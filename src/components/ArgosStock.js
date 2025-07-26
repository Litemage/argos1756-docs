// List of all WCP HTD 5mm 9mm-wide belt sizes (teeth count)
// Source: https://wcproducts.com/collections/belts-chain-gears/products/htd-timing-belts-9mm-width

export const WCP_HTD_9MM_BELT_SIZES = [
  30, 35, 40, 43, 45, 50, 53, 55, 60, 64, 65, 70, 75, 80, 85, 90, 95, 100, 104, 105,
  110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185,
  190, 195, 200, 210, 220, 225, 230, 240, 250, 260, 270, 280, 290, 300
];

// Argos Stocked Belts (example list, update as needed)
export const ARGOS_STOCKED_BELT_SIZES = [
  70
];
// Stock image data for tag search
export const stockImages = [
  { name: 'Box 1', src: '/argos1756-docs/img/Stock/Box_1.png', tags: ['hex bearing','Shaft Collar','Hex Bushing','Hex 3D printed inserts','Bearing 1/4','Hex Shaft Coupler'],
    tagInventory: {
      'hex bearing': 10,
      'Shaft Collar': 5,
      'Hex Bushing': 8,
      'Hex 3D printed inserts': 12,
      'Bearing 1/4': 6,
      'Hex Shaft Coupler': 3
    }
  },
  { name: 'Box 2', src: '/argos1756-docs/img/Stock/Box_2.png', tags: ['Master Links','Chain tensioner','Master Link', 'Chain size','Half Links'],
    tagInventory: {
      'Master Links': `unknown`,
      'Chain tensioner': 4,
      'Master Link': 20,
      'Chain size': 2,
      'Half Links': 7
    }
  },
  { name: 'Box 3', src: '/argos1756-docs/img/Stock/Box_3.png', tags: ['Tap','Hot Glue','Loctite','Lubricant'],
    tagInventory: {
      'Tap': 2,
      'Hot Glue': 3,
      'Loctite': 1,
      'Lubricant': 5
    }
  },
  { name: 'Box 4', src: '/argos1756-docs/img/Stock/Box_4.png', tags: ['LimeLight', 'CAN encoder','Through Bore Hex encoder','IMU','Canivore'],
    tagInventory: {
      'LimeLight': 1,
      'CAN encoder': 2,
      'Through Bore Hex encoder': 1,
      'IMU': 1,
      'Canivore': 1,
      'unknown': null,
      'Krone': null,
      'Bradley': null,
      'Joe': null,
      'Sma': null,
      'J23': null,
      'vd': null,
      'dfad': null,
      'fadf': null,
      'usf': null,
      'uwe': null,
      'ukj': null,
      'un': null
    }
  },
  // Add more images/tags here
];
