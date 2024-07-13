export type TProjectSOwFormComponentProps = {}
export type TProjectSOwFormViewProps = {
  activeStep: number
  enabledStep: number
  steps: any[]
  completed: number[]
  handleStep: () => void
  errorMessage: any[]
  projectSOWFormData: any
  handleProjectSOWChange: () => void
  setTranscriptMeetingLinks: () => void
  transcriptMeetingLinks: any
  summaryText: any
  setSummaryText: any
  problemGoalText: any
  setProblemGoalText: any
  overviewText: any
  setOverviewText: any
  scopeOfWorkData: any
  handleScopeOfWorkCheckbox: any
  selectedScopeOfWorkData: any
  serviceGroupByProjectTypeId: any
  selectedAdditionalServiceData: any
  handleAdditionalServiceSelection: any

  handleDeliverableCheckboxBySow: any
  handleDeliverableCheckbox: any
  selectedDeliverableData: any
  handleDeliverableNoteAdd: any
  deliverableNotesData: any
  handleNotesInputChange: any
  handleDeliverableNoteRemove: any
}

export function scopeOfWorkGroupByAdditionalServiceId(data: any) {
  const groupedData = data?.reduce((acc: { [key: number]: any }, item: any) => {
    const key = item.additionalServiceId ?? ''

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(item)

    return acc
  }, {})

  const result = Object.keys(groupedData)?.map(key => {
    return {
      ...groupedData[key][0]?.additional_service_info,
      scope_of_works: groupedData[key]
    }
  })

  return result
}

export const kimaiUserData = [
  {
    id: 2,
    username: 'joshw',
    email: 'josh@lhgraphics.com',
    hourly_rate: '67.8'
  },
  {
    id: 3,
    username: 'naddie',
    email: 'naddie@lhgraphics.com',
    hourly_rate: '6.66'
  },
  {
    id: 4,
    username: 'kim',
    email: 'kim@lhgraphics.com',
    hourly_rate: '54.33'
  },
  {
    id: 5,
    username: 'testuser',
    email: 'testuser@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 6,
    username: 'testlead',
    email: 'testlead@lhgraphics.com',
    hourly_rate: '25'
  },
  {
    id: 7,
    username: 'jenn@lhgraphics.com',
    email: 'jennifer@lhgraphics.com',
    hourly_rate: '5.5'
  },
  {
    id: 8,
    username: 'tory@lhgraphics.com',
    email: 'tory@lhgraphics.com',
    hourly_rate: '24.72'
  },
  {
    id: 9,
    username: 'hussain@lhgraphics.com',
    email: 'hussain@lhgraphics.com',
    hourly_rate: '18'
  },
  {
    id: 10,
    username: 'rana@lhgraphics.com',
    email: 'rana@lhgraphics.com',
    hourly_rate: '14.85'
  },
  {
    id: 11,
    username: 'ron@lhgraphics.com',
    email: 'ron@lhgraphics.com',
    hourly_rate: '35'
  },
  {
    id: 12,
    username: 'brian@lhgraphics.com',
    email: 'brian@lhgraphics.com',
    hourly_rate: '4.5'
  },
  {
    id: 13,
    username: 'sara@lhgraphics.com',
    email: 'sara@lhgraphics.com',
    hourly_rate: '20'
  },
  {
    id: 14,
    username: 'lhg-raju',
    email: 'raju@lhgraphics.com',
    hourly_rate: '14.69'
  },
  {
    id: 15,
    username: 'vanessa@lhgraphics.com',
    email: 'vanessa@lhgraphics.com',
    hourly_rate: '5.45'
  },
  {
    id: 16,
    username: 'tauhid@lhgraphics.com',
    email: 'tauhid@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 17,
    username: 'jamal@lhgraphics.com',
    email: 'jamal@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 18,
    username: 'anna@lhgraphics.com',
    email: 'anna@lhgraphics.com',
    hourly_rate: '8.5'
  },
  {
    id: 19,
    username: 'ana@lhgraphics.com',
    email: 'ana@lhgraphics.com',
    hourly_rate: '5.45'
  },
  {
    id: 20,
    username: 'aika@lhgraphics.com',
    email: 'aika@lhgraphics.com',
    hourly_rate: '4'
  },
  {
    id: 21,
    username: 'kj@lhgraphics.com',
    email: 'kj@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 22,
    username: 'saravanan@lhgraphics.com',
    email: 'saravanan@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 23,
    username: 'rajesh@lhgraphics.com',
    email: 'rajesh@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 24,
    username: 'bazeeth@lhgraphics.com',
    email: 'bazeeth@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 25,
    username: 'mb@lhgraphics.com',
    email: 'mb@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 26,
    username: 'suguna@lhgraphics.com',
    email: 'suguna@lhgraphics.com',
    hourly_rate: '12.5'
  },
  {
    id: 29,
    username: 'nicholle@lhgraphics.com',
    email: 'nicholle@lhgraphics.com',
    hourly_rate: '8'
  },
  {
    id: 30,
    username: 'suzanne@lhgraphics.com',
    email: 'suzanne@lhgraphics.com',
    hourly_rate: '50'
  },
  {
    id: 32,
    username: 'faheemlogo@gmail.com',
    email: 'faheem@lhgraphics.com',
    hourly_rate: '12'
  },
  {
    id: 33,
    username: 'ali@lhgraphics.com',
    email: 'ali@lhgraphics.com',
    hourly_rate: '12'
  },
  {
    id: 36,
    username: 'lea@lhgraphics.com',
    email: 'lea@lhgraphics.com',
    hourly_rate: '8'
  },
  {
    id: 39,
    username: 'vishal@worldwebtechnology.com',
    email: 'vishal@worldwebtechnology.com',
    hourly_rate: '15'
  },
  {
    id: 41,
    username: 'varun@lhgraphics.com',
    email: 'varun@lhgraphics.com',
    hourly_rate: '13'
  },
  {
    id: 42,
    username: 'umar@lhgraphics.com',
    email: 'umar@lhgraphics.com',
    hourly_rate: '16'
  },
  {
    id: 44,
    username: 'tanmoy@lhgdev.com',
    email: 'tanmoy@lhgdev.com',
    hourly_rate: '15'
  },
  {
    id: 45,
    username: 'syed@lhgraphics.com',
    email: 'syed@lhgraphics.com',
    hourly_rate: '12'
  },
  {
    id: 46,
    username: 'swadesh.s@theaquarious.com',
    email: 'swadesh.s@theaquarious.com',
    hourly_rate: '15'
  },
  {
    id: 47,
    username: 'raj@lhgraphics.com',
    email: 'raj@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 48,
    username: 'Suman',
    email: 'suman.j@theaquarious.com',
    hourly_rate: '15'
  },
  {
    id: 49,
    username: 'Olija',
    email: 'olija@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 51,
    username: 'Joy',
    email: 'joy@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 52,
    username: 'Bilal',
    email: 'bilal@lhgraphics.com',
    hourly_rate: '12'
  },
  {
    id: 54,
    username: 'Hamza',
    email: 'hamza@lhgraphics.com',
    hourly_rate: '15'
  },
  {
    id: 55,
    username: 'Budget Test User',
    email: 'budget-test@gmail.com',
    hourly_rate: '12'
  },
  {
    id: 56,
    username: 'ahmed',
    email: 'ahmed@lhgraphics.com',
    hourly_rate: '12'
  },
  {
    id: 57,
    username: 'Rahat',
    email: 'rahat@lhgraphics.com',
    hourly_rate: '8'
  },
  {
    id: 66,
    username: 'ray',
    email: 'ray@lhgraphics.com',
    hourly_rate: '72.12'
  },
  {
    id: 70,
    username: 'Belayet',
    email: 'belayetriadbd@gmail.com',
    hourly_rate: '10'
  },
  {
    id: 71,
    username: 'Biplob',
    email: 'send2biplob.bd@gmail.com',
    hourly_rate: '6'
  },
  {
    id: 148,
    username: 'Dairen De Luna',
    email: 'dairen@lhgraphics.com',
    hourly_rate: '6'
  },
  {
    id: 149,
    username: 'Ben Reno',
    email: 'ben@lhgraphics.com',
    hourly_rate: '18'
  },
  {
    id: 152,
    username: 'akib',
    email: 'ahmudul.devop@gmail.com',
    hourly_rate: '12'
  },
  {
    id: 153,
    username: 'Shamim',
    email: 'nn.shamim.soft@gmail.com',
    hourly_rate: '10'
  },
  {
    id: 154,
    username: 'Melvin Peradilla',
    email: 'melvin@lhgraphics.com',
    hourly_rate: '16.5'
  },
  {
    id: 155,
    username: 'Apoorva Chauhan',
    email: 'apoorva@chauhanseo.com',
    hourly_rate: '9.38'
  }
]
