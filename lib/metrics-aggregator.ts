import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { OrgImpactMetrics } from './db-metrics'

export async function recalculateNetworkMetrics(): Promise<void> {
  const orgMetricsQuery = query(collection(db, 'orgImpactMetrics'), orderBy('month', 'asc'))
  const snapshot = await getDocs(orgMetricsQuery)

  const monthlyAggregation: Record<
    string,
    {
      youthImpacted: number
      discoveryFlights: number
      eventsHosted: number
      certifications: number
      volunteerHours: number
    }
  > = {}

  snapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data() as OrgImpactMetrics
    const monthKey = data.month

    if (!monthlyAggregation[monthKey]) {
      monthlyAggregation[monthKey] = {
        youthImpacted: 0,
        discoveryFlights: 0,
        eventsHosted: 0,
        certifications: 0,
        volunteerHours: 0,
      }
    }

    monthlyAggregation[monthKey].youthImpacted += data.youthImpacted || 0
    monthlyAggregation[monthKey].discoveryFlights += data.discoveryFlights || 0
    monthlyAggregation[monthKey].eventsHosted += data.eventsHosted || 0
    monthlyAggregation[monthKey].certifications += data.certifications || 0
    monthlyAggregation[monthKey].volunteerHours += data.volunteerHours || 0
  })

  const totals = Object.values(monthlyAggregation).reduce(
    (acc, month) => {
      acc.totalYouthImpacted += month.youthImpacted
      acc.totalDiscoveryFlights += month.discoveryFlights
      acc.totalEventsHosted += month.eventsHosted
      acc.totalCertifications += month.certifications
      acc.totalVolunteerHours += month.volunteerHours
      return acc
    },
    {
      totalYouthImpacted: 0,
      totalDiscoveryFlights: 0,
      totalEventsHosted: 0,
      totalCertifications: 0,
      totalVolunteerHours: 0,
    }
  )

  await setDoc(
    doc(db, 'metrics', 'network'),
    {
      ...totals,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  )

  const monthlySnapshots = Object.entries(monthlyAggregation)
  await Promise.all(
    monthlySnapshots.map(([month, values]) =>
      setDoc(
        doc(db, 'networkMonthlyMetrics', month),
        {
          ...values,
          month,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    )
  )
}
