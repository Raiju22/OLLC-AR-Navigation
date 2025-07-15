
export interface Room {
  id: string;
  name: string;
}

export interface Floor {
  name: string;
  rooms: Room[];
}

export interface Building {
  id: string;
  name: string;
  floors: Floor[];
}

export const popularDestinations: Room[] = [
    { id: 'shs-1-1', name: 'Registrar' },
    { id: 'shs-1-2', name: 'Office' },
    { id: 'shs-3-1', name: 'Astrodome'},
    { id: 'shs-1-3', name: 'Clinic' },
    { id: 'shs-2-3', name: 'ComLab' },
    { id: 'elem-building', name: 'Elem. Building' },
];

export const buildings: Building[] = [
  {
    id: 'shs-building',
    name: 'SHS Building',
    floors: [
      {
        name: 'First Floor',
        rooms: [
          { id: 'shs-1-1', name: 'Registrar' },
          { id: 'shs-1-2', name: 'Office' },
          { id: 'shs-1-3', name: 'Clinic' },
        ],
      },
      {
        name: 'Second Floor',
        rooms: [
          { id: 'shs-2-1', name: 'Dean Office' },
          { id: 'shs-2-2', name: 'Library' },
          { id: 'shs-2-3', name: 'ComLab' },
        ],
      },
      {
          name: 'Third Floor',
          rooms: [
              { id: 'shs-3-1', name: 'Astrodome' },
              { id: 'shs-3-2', name: 'Room 3-02' },
              { id: 'shs-3-3', name: 'Room 3-03' },
              { id: 'shs-3-4', name: 'Room 3-04' },
              { id: 'shs-3-5', name: 'Room 3-05' },
              { id: 'shs-3-6', name: 'Room 3-06' },
          ]
      }
    ],
  },
  {
    id: 'elem-building',
    name: 'Elem. Building',
    floors: [
      {
        name: 'First Floor',
        rooms: [
          { id: 'elem-1-1', name: 'Room 101' },
          { id: 'elem-1-2', name: 'Room 102' },
          { id: 'elem-1-3', name: 'Room 103' },
          { id: 'elem-1-4', name: 'Room 104' },
          { id: 'elem-1-5', name: 'Room 105' },
          { id: 'elem-1-6', name: 'Room 106' },
        ],
      },
       {
        name: 'Second Floor',
        rooms: [
          { id: 'elem-2-1', name: 'Room 201' },
          { id: 'elem-2-2', name: 'Room 202' },
          { id: 'elem-2-3', name: 'Room 203' },
          { id: 'elem-2-4', name: 'Room 204' },
          { id: 'elem-2-5', name: 'Room 205' },
          { id: 'elem-2-6', name: 'Room 206' },
        ],
      },
    ],
  },
];
