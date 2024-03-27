import { ReactNode } from 'react'
import AppLayout from 'src/layouts/AppLayout'
import HourlyRatesComponent from 'src/views/service-management/hourly-rates/HourlyRates.component'

const HourlyRates = () => {
  return <HourlyRatesComponent></HourlyRatesComponent>
}
HourlyRates.getLayout = (page: ReactNode) => <AppLayout>{page}</AppLayout>
export default HourlyRates
