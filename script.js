

document.addEventListener('DOMContentLoaded', (event) => {

var dragSrcEl = null;

function handleDragStart(e) {
  this.style.opacity = '0.4';
  
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }

  e.dataTransfer.dropEffect = 'move';
  
  return false;
}

function handleDragEnter(e) {
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  
  return false;
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  
  items.forEach(function (item) {
    item.classList.remove('over');
  });
}

  
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
  });
});

function saveToLocalStorage() {
    const boxes = document.querySelectorAll('.box');
    const boxOrder = [];
    boxes.forEach(box => {
        boxOrder.push(box.textContent);
    });
    localStorage.setItem('boxOrder', JSON.stringify(boxOrder));
}

// Функция для загрузки списка из localStorage при загрузке страницы
function loadFromLocalStorage() {
    const savedBoxOrder = localStorage.getItem('boxOrder');
    if (savedBoxOrder) {
        const boxOrder = JSON.parse(savedBoxOrder);
        const boxes = document.querySelectorAll('.box');
        boxOrder.forEach((value, index) => {
            boxes[index].textContent = value;
        });
    }
}

// Сохраняем список в localStorage при изменении сетки
const container = document.querySelector('.container');
container.addEventListener('dragend', saveToLocalStorage);

// Загружаем список из localStorage при загрузке страницы
window.addEventListener('load', loadFromLocalStorage);

// 'Arman', 'Samat' ...
const boxes = document.querySelectorAll('.box');

function changeValues() {
    boxes.forEach((box, index) => {
        switch (index % 3) {
            case 0:
                box.textContent = 'Samat';
                break;
            case 1:
                box.textContent = 'Arman';
                break;
            case 2:
                box.textContent = 'Marat';
                break;
        }
    });
}

//Import 

function dragOverHandler(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function dropHandler(event) {
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  if (fileList.length > 0) {
      const file = fileList[0];
      if (file.type === 'text/plain') {
          readFile(file);
          document.getElementById('drag-text').innerText = "Файл загружен";
          setTimeout(() => {
              document.getElementById('drag-text').innerText = "Перетащите файл с именами VIP сюда";
          }, 2000);
      } else {
          alert('Пожауйста, перетащите файл в формате текстового файла.');
      }
  }
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
      const content = event.target.result;
      buildVIPGrid(content);
  };
  reader.readAsText(file);
}

function buildVIPGrid(content) {
  alert('it works');
  const vipList = content.split('\n').slice(2).filter(name => name.trim() !== '');
  const vipGrid = document.querySelector('.container');
  vipGrid.innerHTML = ''; // Очистим существующий список VIP
  vipList.forEach(name => {
      const vipElement = document.createElement('div');
      vipElement.classList.add('box');
      vipElement.textContent = name.trim().substring(2); // Удаляем дефис и пробел перед именем
      vipGrid.appendChild(vipElement);
  });
}

function dragEnterHandler(event) {
  document.getElementById('drop-area').style.backgroundColor = "#f0f0f0";
}

function dragLeaveHandler(event) {
  document.getElementById('drop-area').style.backgroundColor = "#fff";
}
//fullscreen
const fullscreenButton = document.getElementById('fullscreen-btn');
const dropArea = document.getElementById('drop-area1');

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        dropArea.classList.add('fullscreen');
        document.body.style.overflow = 'hidden'; // Чтобы скрыть полосы прокрутки страницы
        fullscreenButton.innerText = "Выйти из полноэкранного режима";
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Ошибка при входе в полноэкранный режим: ${err.message}`);
        });
    } else {
        dropArea.classList.remove('fullscreen');
        document.body.style.overflow = ''; // Восстанавливаем значение по умолчанию
        fullscreenButton.innerText = "Полноэкранный режим";
        document.exitFullscreen().catch(err => {
            console.error(`Ошибка при выходе из полноэкранный режим: ${err.message}`);
        });
    }
}

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        dropArea.classList.remove('fullscreen');
        document.body.style.overflow = ''; // Восстанавливаем значение по умолчанию
        fullscreenButton.innerText = "Полноэкранный режим";
    }
});

function getVIPList() {
    const container = document.getElementById('drop-area1');
    const boxes = container.querySelectorAll('.box');
    let vipList = '# VIP List\n\n';

    boxes.forEach((box, index) => {
        const name = box.textContent.trim();
        if (name !== '') {
            vipList += `- ${name}\n`;
        } else {
            vipList += `- \n`; // Пустое поле в списке VIP
        }
    });

    return vipList;
}

function copyToClipboard() {
  const vipList = getVIPList();
  const textArea = document.getElementById('vip-list');
  textArea.value = vipList;
  textArea.select();
  document.execCommand('copy');
  alert('Список VIP скопирован в буфер обмена!');
}

function downloadVIPList() {
  const vipList = getVIPList();
  const blob = new Blob([vipList], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vip-list.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}