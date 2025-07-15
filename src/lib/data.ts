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

export const buildings: Building[] = [
  {
    id: 'shs-building',
    name: 'SHS Building',
    floors: [
      {
        name: '1st Floor',
        rooms: [
          { id: 'shs-1-1', name: 'Registrar' },
          { id: 'shs-1-2', name: 'Office' },
          { id: 'shs-1-3', name: 'Clinic' },
        ],
      },
      {
        name: '2nd Floor',
        rooms: [
          { id: 'shs-2-1', name: 'Room 201' },
          { id: 'shs-2-2', name: 'Room 202' },
          { id: 'shs-2-3', name: 'Computer Lab' },
        ],
      },
    ],
  },
  {
    id: 'elem-building',
    name: 'Elem. Building',
    floors: [
      {
        name: '1st Floor',
        rooms: [
          { id: 'elem-1-1', name: 'Office' },
          { id: 'elem-1-2', name: 'Guidance' },
          { id: 'elem-1-3', name: 'Canteen' },
          { id: 'elem-1-4', name: 'Room 101' },
          { id: 'elem-1-5', name: 'Room 102' },
        ],
      },
       {
        name: '2nd Floor',
        rooms: [
          { id: 'elem-2-1', name: 'Library' },
          { id: 'elem-2-2', name: 'Faculty' },
          { id: 'elem-2-3', name: 'Room 201' },
          { id: 'elem-2-4', name: 'Room 202' },
        ],
      },
    ],
  },
];
