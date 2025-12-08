import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { db } from './firebase'

export interface NetworkImpactMetrics {
  id: string // 'network'
  totalYouthImpacted: number
  totalDiscoveryFlights: number
  totalEventsHosted: number
  totalCertifications: number
  totalVolunteers: number
  totalOrganizations: number
  lastUpdated: Date
}

export interface OrgImpactMetrics {
  orgId: string
  month: string // YYYY-MM
  youthImpacted: number
  discoveryFlights: number
  eventsHosted: number
  certifications: number
  volunteerHours: number
  updatedAt: Date
}

const networkMetricsDoc = doc(db, 'metrics', 'network')
const orgMetricsCollection = collection(db, 'orgImpactMetrics')
const networkMonthlyCollection = collection(db, 'networkMonthlyMetrics')

function mapNetworkMetrics(snapshot: any): NetworkImpactMetrics | null {
  if (!snapshot.exists()) return null
  const data = snapshot.data()
  return {
    id: snapshot.id,
    totalYouthImpacted: data.totalYouthImpacted || 0,
    totalDiscoveryFlights: data.totalDiscoveryFlights || 0,
    totalEventsHosted: data.totalEventsHosted || 0,
    totalCertifications: data.totalCertifications || 0,
    totalVolunteers: data.totalVolunteers || 0,
    totalOrganizations: data.totalOrganizations || 0,
    lastUpdated: (data.lastUpdated?.toDate?.() as Date) || new Date(),
  }
}

function mapOrgMetrics(snapshot: any): OrgImpactMetrics {
  const data = snapshot.data() || {}
  return {
    orgId: data.orgId,
    month: data.month,
    youthImpacted: data.youthImpacted || 0,
    discoveryFlights: data.discoveryFlights || 0,
    eventsHosted: data.eventsHosted || 0,
    certifications: data.certifications || 0,
    volunteerHours: data.volunteerHours || 0,
    updatedAt: (data.updatedAt?.toDate?.() as Date) || new Date(),
  }
}

export async function getNetworkImpactMetrics(): Promise<NetworkImpactMetrics | null> {
  const snapshot = await getDoc(networkMetricsDoc)
  return mapNetworkMetrics(snapshot)
}

export async function updateNetworkImpactMetrics(
  data: Partial<Omit<NetworkImpactMetrics, 'id' | 'lastUpdated'>>
): Promise<void> {
  await setDoc(
    networkMetricsDoc,
    {
      ...data,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function getOrgImpactMetrics(orgId: string): Promise<OrgImpactMetrics[]> {
  const metricsQuery = query(orgMetricsCollection, where('orgId', '==', orgId), orderBy('month', 'asc'))
  const snapshot = await getDocs(metricsQuery)
  return snapshot.docs.map(mapOrgMetrics)
}

export async function updateOrgImpactMetrics(
  orgId: string,
  data: Omit<OrgImpactMetrics, 'orgId' | 'updatedAt'>
): Promise<void> {
  const docId = `${orgId}-${data.month}`
  const metricDoc = doc(db, 'orgImpactMetrics', docId)

  await setDoc(
    metricDoc,
    {
      ...data,
      orgId,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function getMonthlyNetworkMetrics(): Promise<OrgImpactMetrics[]> {
  const monthlyQuery = query(networkMonthlyCollection, orderBy('month', 'asc'))
  const snapshot = await getDocs(monthlyQuery)
  return snapshot.docs.map(mapOrgMetrics)
}

export const orgImpactMetricsIndexes = {
  indexes: [
    { field: 'orgId' },
    { field: 'month' },
    { field: 'updatedAt' },
  ],
}
