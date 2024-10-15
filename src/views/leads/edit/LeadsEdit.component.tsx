
export default function LeadsEditComponent() {
  const [listData, setListData] = useState<any>([])

  return (
    <>
      <Box className='container px-6 mx-auto'>
        <Box component={'h1'} className='mt-5 mb-4 text-xl font-semibold text-gray-600 d:text-gray-300'>
          Edit Leads
        </Box>
        <LeadsFormComponent listData={listData} setListData={setListData} isEdit={true} />
      </Box>
    </>
  )
}
