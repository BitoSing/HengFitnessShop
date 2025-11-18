// Dynamic product loader for Images folder (images 4-116)

// Function to categorize products based on name
function categorizeProduct(productName, badge = '') {
    const name = productName.toLowerCase();
    
    // Check for special categories based on badge
    if (badge === 'Hot') return 'Hot Sells';
    if (badge === 'New') return 'New Products';
    
    // Regular categories based on product name
    if (name.includes('yoga')) return 'Yoga';
    if (name.includes('boxing') || name.includes('gloves') || name.includes('punching') || name.includes('bag')) return 'Boxing';
    if (name.includes('treadmill')) return 'Treadmills';
    if (name.includes('bike') || name.includes('spin') || name.includes('stationary') || name.includes('cycling')) return 'Bike';
    if (name.includes('trampoline')) return 'Trampolines';
    if (name.includes('dumbbell') || name.includes('kettlebell') || name.includes('weight') || name.includes('barbell')) return 'Dumbbells';
    if (name.includes('resistance') || name.includes('band')) return 'Dumbbells';
    if (name.includes('pull') || name.includes('bench') || name.includes('rack')) return 'Dumbbells';
    if (name.includes('mat') || name.includes('block') || name.includes('strap')) return 'Yoga';
    if (name.includes('rope') || name.includes('jump')) return 'Boxing';
    
    return 'all';
}

// Function to determine badge based on ID
function determineBadge(imageNum) {
    // Mark every 5th item as Hot, and specific ones as New
    if (imageNum % 7 === 0) return 'Hot';
    if (imageNum % 11 === 0) return 'New';
    return '';
}

// Generate price based on product name and ID
function generatePrice(productName, imageNum) {
    const name = productName.toLowerCase();
    let basePrice = 50;
    
    // Category-based pricing
    if (name.includes('treadmill')) basePrice = 280;
    else if (name.includes('bike') || name.includes('spin')) basePrice = 240;
    else if (name.includes('trampoline')) basePrice = 140;
    else if (name.includes('dumbbell') || name.includes('kettlebell')) basePrice = 45;
    else if (name.includes('yoga') || name.includes('mat') || name.includes('block')) basePrice = 35;
    else if (name.includes('boxing') || name.includes('gloves') || name.includes('bag')) basePrice = 65;
    else if (name.includes('bench') || name.includes('rack')) basePrice = 150;
    else if (name.includes('resistance') || name.includes('band')) basePrice = 25;
    
    // Add variance based on image number
    const variance = ((imageNum % 5) * 5);
    return '$' + (basePrice + variance).toFixed(2);
}

// Generate description based on product name
function generateDescription(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('treadmill')) {
        return 'High-performance treadmill with digital display and multiple speed settings. Perfect for cardio training and weight management. Features heart rate monitoring and preset programs. Max weight capacity: 120kg.';
    } else if (name.includes('trampoline')) {
        return 'Heavy-duty fitness trampoline with excellent bounce and safety features. Great for cardio workouts and core strengthening. Weight capacity: 150kg. Includes assembly kit and user manual.';
    } else if (name.includes('bike') || name.includes('spin')) {
        return 'Stationary exercise bike with adjustable resistance levels. Features ergonomic design with comfortable seating. Digital display shows speed, distance, and calories burned. Perfect for indoor cycling workouts.';
    } else if (name.includes('dumbbell')) {
        return 'Premium dumbbells with ergonomic grip and durable construction. Perfect for strength training and muscle building. Available in multiple weight options. Ideal for both home and commercial use.';
    } else if (name.includes('kettlebell')) {
        return 'Cast iron kettlebell with smooth finish and wide handle. Perfect for dynamic movements and functional training. Builds strength, power, and endurance. Suitable for all fitness levels.';
    } else if (name.includes('yoga') || name.includes('mat')) {
        return 'Premium yoga mat with non-slip surface and extra cushioning for comfort. Made from eco-friendly materials. Perfect for yoga, pilates, and floor exercises. Includes carrying strap for easy transport.';
    } else if (name.includes('yoga block')) {
        return 'High-density foam yoga blocks for proper alignment support. Lightweight and durable. Perfect for deepening stretches and modifying poses. Pair with your yoga mat for enhanced practice.';
    } else if (name.includes('boxing') || name.includes('gloves')) {
        return 'Professional boxing gloves with gel padding and wrist support. Available in multiple sizes. Features moisture-wicking inner lining. Suitable for training, sparring, and competition.';
    } else if (name.includes('punching bag') || name.includes('heavy bag')) {
        return 'Professional-grade heavy bag for boxing and MMA training. Durable construction with chain and bracket. Great for cardio and power development. Mount to ceiling or wall.';
    } else if (name.includes('resistance band')) {
        return 'Multi-level resistance bands set for strength training and physical therapy. Color-coded for easy identification. Portable and durable. Perfect for all fitness levels.';
    } else if (name.includes('bench')) {
        return 'Adjustable weight bench for strength training exercises. Sturdy construction with multiple incline positions. Perfect for dumbbell and barbell exercises. Max weight capacity: 300kg.';
    } else if (name.includes('rack')) {
        return 'Heavy-duty equipment rack for organizing and storing fitness equipment. Durable steel construction. Space-saving design. Perfect for home or commercial gyms.';
    } else if (name.includes('jump rope')) {
        return 'Professional-grade jump rope for cardio training. Adjustable length and lightweight design. Great for warm-ups and conditioning. Suitable for all fitness levels.';
    } else if (name.includes('strap')) {
        return 'Heavy-duty fitness straps for weight lifting and training support. Premium quality material. Helps improve grip and reduce hand fatigue. Essential accessory for strength training.';
    }
    
    return 'Premium fitness equipment designed for optimal performance and durability. Perfect addition to any home or commercial gym setup. Suitable for all fitness levels.';
}

// Format filename to readable product name
function formatProductName(filename) {
    // Remove file extension
    let name = filename.replace(/\.[^/.]+$/, '');
    
    // Remove leading numbers and underscore (e.g., "4_" or "04_")
    name = name.replace(/^\d+_/, '');
    
    // Replace underscores and hyphens with spaces
    name = name.replace(/[_-]/g, ' ');
    
    // Capitalize each word
    name = name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    return name;
}

// Translate product names to Khmer
function translateToKhmer(productName) {
    const khmerTranslations = {
        // Equipment types
        'Multigym station': 'ស្ថានីយ៍ហ្វីតនេសពហ្វីតនេស',
        'Multi Gym 3 station': 'ហ្វីតនេសចម្រុះ 3 ស្ថានីយ៍',
        'commercial trampoline': 'ត្រំពូលពាណិជ្ជកម្ម',
        'Mini trampoline': 'ត្រំពូលតូច',
        'Spin Bike': 'កង់ហ្វីតនេសវិល',
        'Electrical Bike': 'កង់អគ្គិសនី',
        'Recubench Excercise': 'គ្រឿងហ្វីតនេសអង្គុយ',
        'Pull up bar': 'របារទាញឡើង',
        'weight bench': 'គ្រឿងហ្វីតនេសទម្ងន់',
        'sit up bench': 'គ្រឿងអង្គុយឡើង',
        'preacher bench': 'គ្រឿងហ្វីតនេសក្រាហ្វិក',
        'square wreck': 'គ្រឿងហ្វីតនេសការ៉េ',
        'Treadmill': 'គ្រឿងរត់កន្លែង',
        'Vibration': 'គ្រឿងញ័រ',
        'Massage': 'គ្រឿងនិង',
        'yoga': 'យោហា',
        'yoga ball': 'គ្រាប់យោហា',
        'yoga mat': 'កម្រាស្យោហា',
        'yoga excerciese': 'លំហាត់យោហា',
        'yoga penut': 'គ្រឿងយោហាដូចពិដោ',
        'Balloon Yoga': 'យោហាសំណឹង',
        'Band Exercise': 'លំហាត់ចង្វាក់',
        'Hand Stand Boxing': 'ប្រដាល់ឈរដៃ',
        'Table Stand Boxing': 'តុប្រដាល់ឈរ',
        'Kid Stand Boxing': 'ប្រដាល់ឈរក្មេង',
        'Stand Boxing': 'ប្រដាល់ឈរ',
        'Rolling': 'គ្រឿងរង្វើល',
        'table bench': 'តុហ្វីតនេស',
        'hard resistance band': 'ចង្វាក់ទប់ខ្លាំង',
        'crip': 'គ្រឿងចង្កឹះ',
        'string': 'ខ្សែហ្វីតនេស',
        'hard band': 'ចង្វាក់ខ្លាំង',
        'pull up stick floor': 'របារទាញឡើងពីក្រោម',
        'weight band': 'ចង្វាក់ទម្ងន់',
        
        // Generic terms
        'Electric': 'អគ្គិសនី',
        'Exercise': 'លំហាត់',
        'Fitness': 'ហ្វីតនេស',
        'Equipment': 'ឧបករណ៍',
        'Premium': 'កម្រិតខ្ពស់',
        'Professional': 'អាជីព',
        'VIP': 'VIP',
        'small': 'តូច',
        'big': 'ធំ',
        'gun': 'ប្រអប់',
        
        // Model numbers
        'mr': 'ម៉ូដែល',
        'King': 'កង់'
    };
    
    let khmerName = productName;
    
    // Translate known terms
    for (const [english, khmer] of Object.entries(khmerTranslations)) {
        khmerName = khmerName.replace(new RegExp(english, 'gi'), khmer);
    }
    
    // If no translation found, return original with Khmer suffix
    if (khmerName === productName) {
        khmerName = productName + ' (ឧបករណ៍ហ្វីតនេស)';
    }
    
    return khmerName;
}

// Generate all products from image 1 to 126
function generateAllProducts() {
    const productsArray = [];
    
    // Map of actual image filenames to product names
    const imageFileMap = {
        1: '1. Multigym station.jpg',
        2: '2. Multi Gym 3 station.jpg',
        3: '3. commercial trampoline.jpg',
        4: '4. Mini trampoline.jpg',
        5: '5. Mr 639.jpg',
        6: '6. Slim Bike.jpg',
        7: '7. Mr 536.jpg',
        8: '8. Mr 581.jpg',
        9: '9. Standing Mr 536.jpg',
        10: '10. mr 657.jpg',
        11: '11. Electric Bike mr 568.jpg',
        12: '12. Mr 667.jpg',
        13: '13. Spin Bike.jpg',
        14: '14. Electrical Bike.jpg',
        15: '15. Recubench Excercise.jpg',
        16: '16. Spin Bike (2).jpg',
        17: '17. Raw machine.jpg',
        18: '18. Pull up bar.jpg',
        19: '19. Pull up bar (2).jpg',
        20: '20. Pull up bar (3).jpg',
        21: '21. Pull up bar (4).jpg',
        22: '22. weight band.jpg',
        23: '23. sit up bench.jpg',
        25: '25. weight bench (2).jpg',
        27: '27. preacher bench.jpg',
        28: '28. square wreck.jpg',
        29: '29. weight bench.jpg',
        31: '31. Treadmill King 480.jpg',
        32: '32. Treadmill 6068ds.jpg',
        33: '33. Treadmill s800ds.jpg',
        34: '34. Vibration small.jpg',
        35: '35. Vibration big.jpg',
        36: '36. gun vibration.jpg',
        100: '100. hard resistance band.jpg',
        101: '101. crip.jpg',
        102: '102. string.jpg',
        103: '103. hard band.jpg',
        104: '104. table bench.jpg',
        105: '105. table bench.jpg',
        106: '106. pull up stick floor.jpg',
        107: '107. Massage.jpg',
        108: '108. yoga excerciese.jpg',
        109: '109. yoga ball.jpg',
        110: '110. yoga ball.jpg',
        111: '111. yoga penut.jpg',
        112: '112. yoga mat.jpg',
        113: '113. yoga mat.jpg',
        114: '114. yoga mat.jpg',
        115: '115. yoga mat.jpg',
        116: '116. yoga mat.jpg',
        117: '117. yoga mat VIP.jpg',
        118: '118. Rolling.jpg',
        119: '119. Rolling VIP.jpg',
        120: '120. Balloon Yoga.jpg',
        121: '121. Band Exercise.jpg',
        122: '122. Band Exercise 2.jpg',
        123: '123. Stand Boxing.jpg',
        124: '124. Kid Stand Boxing.jpg',
        125: '125. Hand Stand Boxing.jpg',
        126: '126. Table Stand Boxing.jpg',
        24: '24. weight bench station.png',
        26: '26. flat bench.png',
        30: '30. weight bench.png',
        37: '37. Bench.jpg',
        38: '38. inverse table.jpg',
        39: '39. inverse table (2).jpg',
        40: '40. inverse table(2).jpg',
        41: '41. weight.jpg',
        42: '42. Stepper.jpg',
        43: '43. Stepper 1.jpg',
        44: '44. Stepper 2.jpg',
        45: '45. Yoga stand.jpg',
        46: '46. Dumbbell.jpg',
        47: '47. Kettle bell.jpg',
        48: '48. Hand dumbbell.jpg',
        49: '49. Dumbbell.jpg',
        50: '50. Plate dumbbell.jpg',
        51: '51. barbell.jpg',
        52: '52. dumbbell Set 15kg.jpg',
        53: '53. dumbbell Set 20kg.jpg',
        54: '54. dumbbell Set 30kg.jpg',
        55: '55. dumbbell Set 50kg.jpg',
        56: '56. hand barbell.jpg',
        57: '57. dumbbell Set 15kg.jpg',
        58: '58. dumbbell Set 20kg.jpg',
        59: '59. Air walker.jpg',
        60: '60. AB Coaster.jpg',
        61: '61. Mini Band.jpg',
        62: '62. Wall pull up.jpg',
        63: '63. Wheel rouler.jpg',
        64: '64. Wheel rouler.jpg',
        65: '65. Wheel rouler.jpg',
        66: '66. Wheel rouler.jpg',
        67: '67. Wheel rouler.jpg',
        68: '68. Wheel rouler.jpg',
        69: '69. Wheel rouler.jpg',
        70: '70. chest workout.jpg',
        71: '71. punching bag.jpg',
        72: '72. punching bag mp3.jpg',
        73: '73. punching human.jpg',
        74: '74. punching bag.jpg',
        75: '75. hang punching bag.jpg',
        76: '76. kid punching bag.jpg',
        77: '77.  punching bag.jpg',
        78: '78.  kid punching bag.jpg',
        79: '79.  table punching.jpg',
        80: '80.  bosu ball.jpg',
        81: '81.  glove.jpg',
        82: '82.  step.jpg',
        83: '83.  belt.jpg',
        84: '84.  string.jpg',
        85: '85. message.jpg',
        86: '86. jumping robe.jpg',
        87: '87. jumping robe.jpg',
        88: '88. multi step.jpg',
        89: '89. pro3.jpg',
        90: '90. pull band.jpg',
        91: '91. AB bench.jpg',
        92: '92. yoga rouler.jpg',
        93: '93. angle weight.jpg',
        94: '94. dardboard.jpg',
        95: '95. chesse angle.jpg',
        96: '96. chesse angle.jpg',
        97: '97. pull up.jpg',
        98: '98. crip.jpg',
        99: '99. glove angle.jpg'
    };
    
    for (let i = 1; i <= 126; i++) {
        // Skip numbers that don't have images
        if (!imageFileMap[i]) {
            continue;
        }
        
        const imageFile = `Images/${imageFileMap[i]}`;
        
        // Extract product name from filename
        let productName = `Product ${i}`;
        
        if (imageFileMap[i]) {
            // Remove the number and extension, then clean up the name
            const cleanName = imageFileMap[i]
                .replace(/^\d+\.\s*/, '') // Remove number prefix
                .replace(/\.(jpg|jpeg|png)$/i, '') // Remove extension
                .replace(/\s*\(\d+\)/, '') // Remove (2), (3) etc.
                .trim();
            
            if (cleanName && cleanName !== '') {
                productName = cleanName;
            }
        }
        
        const badge = determineBadge(i);
        const product = {
            id: String(i).padStart(3, '0'),
            name: productName,
            khmerName: translateToKhmer(productName),
            price: generatePrice(productName, i),
            category: categorizeProduct(productName, badge),
            badge: badge,
            image: imageFile,
            description: generateDescription(productName)
        };
        
        productsArray.push(product);
    }
    
    return productsArray;
}

// Initialize products
const products = generateAllProducts();

// Make products globally accessible
window.products = products;

console.log(`✓ Products initialized: ${products.length} items loaded`);
console.log('Sample products:', products.slice(0, 5));
