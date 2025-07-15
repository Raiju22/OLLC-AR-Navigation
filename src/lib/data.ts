
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
              { id: 'shs-3-1', name: 'Room 3-01' },
              { id: 'shs-3-2', name: 'Room 3-02' },
              { id: 'shs-3-3', name: 'Room 3-03' },
              { id: 'shs-3-4', name: 'Room 3-04' },
              { id: 'shs-3-5', name: 'Room 3-05' },
              { id: 'shs-3-6', name: 'Room 3-06' },
              { id: 'shs-3-7', name: 'Room 3-07' },
              { id: 'shs-3-8', name: 'Room 3-08' },
              { id: 'shs-3-9', name: 'Room 3-09' },
              { id: 'shs-3-10', name: 'Room 3-10' },
              { id: 'shs-3-11', name: 'Room 3-11' },
              { id: 'shs-3-12', name: 'Room 3-12' },
              { id: 'shs-3-13', name: 'Room 3-13' },
              { id: 'shs-3-14', name: 'Room 3-14' },
              { id: 'shs-3-15', name: 'Room 3-15' },
          ]
      },
      {
          name: 'Fourth Floor',
          rooms: [
              { id: 'shs-4-1', name: 'Room 4-01' },
              { id: 'shs-4-2', name: 'Room 4-02' },
              { id: 'shs-4-3', name: 'Room 4-03' },
              { id: 'shs-4-4', name: 'Room 4-04' },
              { id: 'shs-4-5', name: 'Room 4-05' },
              { id: 'shs-4-6', name: 'Room 4-06' },
              { id: 'shs-4-7', name: 'Room 4-07' },
              { id: 'shs-4-8', name: 'Room 4-08' },
              { id: 'shs-4-9', name: 'Room 4-09' },
              { id: 'shs-4-10', name: 'Room 4-10' },
              { id: 'shs-4-11', name: 'Room 4-11' },
              { id: 'shs-4-12', name: 'Room 4-12' },
              { id: 'shs-4-13', name: 'Room 4-13' },
              { id: 'shs-4-14', name: 'Room 4-14' },
              { id: 'shs-4-15', name: 'Room 4-15' },
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
          { id: 'elem-1-7', name: 'Room 107' },
          { id: 'elem-1-8', name: 'Room 108' },
          { id: 'elem-1-9', name: 'Room 109' },
          { id: 'elem-1-10', name: 'Room 110' },
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
          { id: 'elem-2-7', name: 'Room 207' },
          { id: 'elem-2-8', name: 'Room 208' },
          { id: 'elem-2-9', name: 'Room 209' },
          { id: 'elem-2-10', name: 'Room 210' },
        ],
      },
    ],
  },
];
