import React from 'react';
import { useStore } from '@/lib/store';
import { Camera, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { ImageAnalysis } from './ImageAnalysis';
import { supabase } from '@/lib/supabase/client';

export function OrderVerification() {
  const { orders, verifyOrder } = useStore();
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleAnalysisComplete = async (orderId: string, result: { isCorrect: boolean; details: string }) => {
    try {
      setIsUploading(true);

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: result.isCorrect ? 'verified' : 'incorrect',
          verification: {
            verified_at: new Date().toISOString(),
            ai_analysis: result,
            verified_by: (await supabase.auth.getUser()).data.user?.id
          }
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      verifyOrder(orderId, result.isCorrect ? 'verified' : 'incorrect');
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Verification</h2>
          <p className="mt-1 text-gray-600">
            AI-powered order verification ensures accuracy before delivery
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Order #{order.orderCode}</span>
                  <h3 className="font-medium">{order.platform}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' ? (
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"
                      disabled={isUploading}
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-3 py-1 text-sm ${
                          order.status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status === 'verified' ? 'Verified' : 'Incorrect'}
                      </span>
                      {order.imageUrl && (
                        <a
                          href={order.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Items:</h4>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-600">${item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {selectedOrder && (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Verify Order</h3>
            <ImageAnalysis
              orderId={selectedOrder}
              onAnalysisComplete={(result) => handleAnalysisComplete(selectedOrder, result)}
            />
          </div>
        )}
      </div>
    </div>
  );
}