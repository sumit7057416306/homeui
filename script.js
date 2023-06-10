window.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const serviceSelect = document.getElementById('service');
    const labelInput = document.getElementById('label');
    const assignButton = document.getElementById('assign');
    const recommendButton = document.getElementById('recommend');
    
    const gridWidth = 5; // Number of columns in the grid
    const gridHeight = 5; // Number of rows in the grid
    let housingLayout = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(null));
    let houseLabels = {};
    
    function createGrid() {
      for (let i = 0; i < gridHeight; i++) {
        for (let j = 0; j < gridWidth; j++) {
          const gridItem = document.createElement('div');
          gridItem.classList.add('grid-item');
          gridItem.addEventListener('click', () => assignService(i, j));
          grid.appendChild(gridItem);
        }
      }
    }
    
    function assignService(row, col) {
      const service = serviceSelect.value;
      const label = labelInput.value.trim();
      
      if (service === 'House') {
        if (Object.values(houseLabels).includes(label)) {
          alert('A house with the given label already exists.');
          return;
        }
        if (label === '') {
          alert('Please enter a label for the house.');
          return;
        }
        houseLabels[`${row},${col}`] = label;
      }
      
      housingLayout[row][col] = service;
      const gridItem = grid.children[row * gridWidth + col];
      gridItem.textContent = service;
    }
    
    function recommendHouse() {
        const houseScores = {};
        
        // Calculate scores for each house
        for (let row = 0; row < gridHeight; row++) {
          for (let col = 0; col < gridWidth; col++) {
            if (housingLayout[row][col] === 'House') {
              const houseLabel = houseLabels[`${row},${col}`];
              houseScores[houseLabel] = calculateHouseScore(row, col);
            }
          }
        }
        
        // Find the house with the highest score
        let maxScore = -Infinity;
        let bestHouse = '';
        
        for (const houseLabel in houseScores) {
          if (houseScores[houseLabel] > maxScore) {
            maxScore = houseScores[houseLabel];
            bestHouse = houseLabel;
          }
        }
        
        alert(`Best House: ${bestHouse}`);
      }
      
      function calculateHouseScore(row, col) {
        const services = ['Restaurant', 'Gym', 'Hospital'];
        let score = 0;
        
        for (let i = 0; i < gridHeight; i++) {
          for (let j = 0; j < gridWidth; j++) {
            if (housingLayout[i][j] !== null) {
              const distance = Math.abs(i - row) + Math.abs(j - col);
              
              if (services.includes(housingLayout[i][j])) {
                score += 1 / (distance + 1); // Increase score based on service proximity
              }
            }
          }
        }
        
        return score.toFixed(2);
      }
      
      createGrid();
      
      assignButton.addEventListener('click', () => {
        const label = labelInput.value.trim();
        if (label === '') {
          alert('Please enter a label for the house.');
          return;
        }
        
        const selectedService = serviceSelect.value;
        const houseExists = Object.values(houseLabels).includes(label);
        
        if (selectedService === 'House' && houseExists) {
          alert('A house with the given label already exists.');
          return;
        }
        
        const gridItems = document.getElementsByClassName('grid-item');
        Array.from(gridItems).forEach((gridItem, index) => {
          gridItem.textContent = '';
          
          const row = Math.floor(index / gridWidth);
          const col = index % gridWidth;
          
          if (housingLayout[row][col] === selectedService) {
            housingLayout[row][col] = null;
          }
          
          if (selectedService === 'House' && houseLabels[`${row},${col}`] === label) {
            delete houseLabels[`${row},${col}`];
          }
        });
        
        const selectedGridItem = grid.children[row * gridWidth + col];
        selectedGridItem.textContent = selectedService;
        housingLayout[row][col] = selectedService;
        
        if (selectedService === 'House') {
          houseLabels[`${row},${col}`] = label;
        }
        
        labelInput.value = '';
      });
      
      recommendButton.addEventListener('click', recommendHouse);
    });
    
  