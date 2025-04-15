import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Package, Users, CheckSquare, AlertTriangle } from 'lucide-react-native';
import { useStore } from '../store';

export function Dashboard() {
  const navigation = useNavigation();
  const {
    activePositions,
    scheduledInterviews,
    lowStockItems,
    pendingOrders,
    ordersChecked,
    issuesDetected,
  } = useStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('Inventory')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Inventory Status</Text>
            <Package color="#6B7280" size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Low Stock Items: {lowStockItems}</Text>
            <Text style={styles.cardText}>Pending Orders: {pendingOrders}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Staff Overview</Text>
            <Users color="#6B7280" size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>
              Active Hiring: {activePositions} positions
            </Text>
            <Text style={styles.cardText}>
              Scheduled Interviews: {scheduledInterviews}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quality Metrics</Text>
            <CheckSquare color="#6B7280" size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>Orders Checked: {ordersChecked}</Text>
            <Text style={styles.cardText}>Issues Detected: {issuesDetected}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>System Health</Text>
            <AlertTriangle color="#6B7280" size={24} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardText}>All Systems Operational</Text>
            <Text style={styles.cardText}>Last Update: 5 minutes ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cardContent: {
    gap: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4B5563',
  },
});