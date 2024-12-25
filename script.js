const sudokuGrid = document.querySelector('.sudoku__grid');



let sudoku = [9]

for (let a = 0; a < 9; a++){ //boucle pour lignes
  for (let b = 0; b < 9;b++){ //boucle pour colonnes
  const input = document.createElement("input"); //creaion des input par tours de boucles
    input.type = "text";
    input.maxLength = 1;
    input.classList.add("sudoku__cell");

    sudokuGrid.appendChild(input);// ajout de l'input à la grille. a chaques boucles on ajoute un input à sudokuGrid formant une grille. appendhild ajoute chaque input en tant qu'enfant à sudokuGrid.
  

  }

}

const initialGrid = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
];


function fillGrid() {
  const cell = document.querySelectorAll('.sudoku__cell'); //selection de toutes les cellules
  let index = 0;


  for (let row = 0; row < 9; row++) { //parcours les lignes
    for (let col = 0; col < 9; col ++){//parcours les colonnes
      const value = initialGrid[row][col]; //recupération des valeurs correspondantes
      if (value !== 0) {
        cell[index].value = value; // remplir la cellule avec la valeur de initialGrid
        cell[index].disabled = true; //desactiver les cellules préremplies et empeche l'utilisateur de la modifier
      }
      index++; //permets de parcourir toutes les cellules
    }
  }

}
fillGrid(); //appeler la fonction pour remplir la grille

//------- validation des entrées--------//

function checkEnter(initialGrid, ligne, colonne) {
  console.log(initialGrid[ligne][colonne]);
  


}

checkEnter(initialGrid, 0, 1);



const cells = document.querySelectorAll('.sudoku__cell');

// Écouter les saisies sur chaque cellule
cells.forEach((cell, index) => {
  cell.addEventListener('input', () => {
    const row = Math.floor(index / 9); // Calculer la ligne
    const col = index % 9;             // Calculer la colonne
    const value = cell.value;          // Valeur saisie

    if (!isValid(row, col, value)) {
      cell.classList.add('invalid');  // Marquer comme invalide
    } else {
      cell.classList.remove('invalid'); // Réinitialiser l'état
    }
  });
});

function isValid(row, col, value) {
  if (!value.match(/^[1-9]$/)) return false; // Assure que c'est un chiffre entre 1 et 9

  // Vérifier la ligne
  for (let c = 0; c < 9; c++) {
    if (c !== col && cells[row * 9 + c].value === value) {
      return false;
    }
  }

  // Vérifier la colonne
  for (let r = 0; r < 9; r++) {
    if (r !== row && cells[r * 9 + col].value === value) {
      return false;
    }
  }

  // Vérifier le bloc 3x3
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && cells[r * 9 + c].value === value) {
        return false;
      }
    }
  }

  return true; // Si tout est OK
}


document.getElementById('validateGrid').addEventListener('click', () => {
  const isValidGrid = validateGrid(); // Vérifie toute la grille
  const messageElement = document.getElementById('validationMessage');

  if (isValidGrid) {
    messageElement.textContent = "La grille est correcte ! 🎉";
    messageElement.style.color = "green";
  } else {
    messageElement.textContent = "Il y a des erreurs dans la grille. ❌";
    messageElement.style.color = "red";
  }
});


function validateGrid() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cellIndex = row * 9 + col;
      const value = cells[cellIndex].value;

      if (!value || !isValid(row, col, value)) {
        cells[cellIndex].classList.add('invalid'); // Met en rouge les erreurs
        return false; // Arrête dès qu'une erreur est détectée
      } else {
        cells[cellIndex].classList.remove('invalid'); // Supprime les erreurs si corrigées
      }
    }
  }
  return true; // Si tout est valide
}


document.getElementById('generateGrid').addEventListener('click', () => {
  const shuffledGrid = shuffleGrid(initialGrid); // Mélange `initialGrid`
  const playableGrid = removeNumbers(shuffledGrid, 30); // 30 indices visibles
  renderGrid(playableGrid); // Affiche la grille
});


function shuffleGrid(grid) {
  // Mélange des lignes dans chaque bloc
  for (let block = 0; block < 3; block++) {
    const rows = grid.slice(block * 3, block * 3 + 3); // Récupère les 3 lignes d'un bloc
    shuffleArray(rows); // Mélange les lignes
    grid.splice(block * 3, 3, ...rows); // Réintègre les lignes mélangées
  }

  // Transpose la grille pour faire la même chose sur les colonnes
  let transposed = transpose(grid);
  for (let block = 0; block < 3; block++) {
    const cols = transposed.slice(block * 3, block * 3 + 3); // Récupère les 3 colonnes d'un bloc
    shuffleArray(cols); // Mélange les colonnes
    transposed.splice(block * 3, 3, ...cols); // Réintègre les colonnes mélangées
  }

  return transpose(transposed); // Retourne à l'état initial après mélange
}

// Mélange d'un tableau (exemple pour les lignes ou colonnes)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fonction de transposition
function transpose(grid) {
  return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));
}


function removeNumbers(grid, clues = 30) {
  const gridCopy = JSON.parse(JSON.stringify(grid)); // Crée une copie de la grille
  let cellsToRemove = 81 - clues; // Nombre de cases à supprimer

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (gridCopy[row][col] !== 0) {
      gridCopy[row][col] = 0; // Supprime un chiffre
      cellsToRemove--;
    }
  }

  return gridCopy; // Retourne la grille jouable
}

function renderGrid(grid) {
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;

    if (grid[row][col] !== 0) {
      cell.value = grid[row][col];
      cell.disabled = true; // Empêche de modifier les valeurs fixes
    } else {
      cell.value = '';
      cell.disabled = false; // Permet de remplir les cases vides
    }
  });
}


document.getElementById('generateGrid').addEventListener('click', () => {
  const defaultClues = 35; // Nombre d'indices pour le niveau par défaut (moyen)

  // Feedback utilisateur
  showFeedback("Génération d'une grille (niveau moyen par défaut)...", 2000);

  // Générer une grille avec le niveau par défaut
  const shuffledGrid = shuffleGrid(initialGrid); // Mélange la grille initiale
  const playableGrid = removeNumbers(shuffledGrid, defaultClues); // Grille avec indices par défaut
  renderGrid(playableGrid); // Affiche la grille dans le DOM
});



function showFeedback(message, duration = 2000, icon = "🔄") {

  const feedbackMessage = document.getElementById('feedbackMessage');
  const feedbackText = document.getElementById('feedbackText');
  const feedbackIcon = document.querySelector('.feedbackIcon');

  feedbackText.textContent = message;
  feedbackIcon.textContent = icon;
  feedbackMessage.style.opacity = 1;

  setTimeout(() => {
    feedbackMessage.style.opacity = 0;
  }, duration);
}


document.getElementById('generateGrid').addEventListener('click', () => {
  // Ajoute le message de chargement
  showFeedback("Génération de la grille en cours...");
  showFeedback("Niveau par défaut : Moyen", 2000);


  // Ajoute la classe "loading" à toutes les cellules
  cells.forEach(cell => cell.classList.add('loading'));

  // Délai pour simuler le chargement (1 seconde)
  setTimeout(() => {
    const shuffledGrid = shuffleGrid(initialGrid); // Mélange la grille initiale
    const playableGrid = removeNumbers(shuffledGrid, 30); // Garde 30 indices visibles
    renderGrid(playableGrid); // Affiche la grille dans le DOM

    // Retire la classe "loading" et affiche un message de succès
    cells.forEach(cell => cell.classList.remove('loading'));
    showFeedback("Nouvelle grille générée avec succès !", 2000);
  }, 1000); // 1 seconde
});


// Sélection des boutons de difficulté
const difficultyButtons = document.querySelectorAll('.difficulty');

// Écouteur sur chaque bouton
difficultyButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const clues = parseInt(e.target.dataset.clues); // Nombre d'indices à partir du bouton cliqué

    // Feedback utilisateur
    showFeedback(`Niveau sélectionné : ${e.target.textContent}`, 2000);

    // Générer une grille avec le niveau choisi
    const shuffledGrid = shuffleGrid(initialGrid); // Mélange la grille initiale
    const playableGrid = removeNumbers(shuffledGrid, clues); // Ajuste selon les indices
    renderGrid(playableGrid); // Affiche la grille
  });
});
