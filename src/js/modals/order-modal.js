import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const close = document.querySelector('.order-modal-svg-close');
const modal = document.querySelector('.order-modal');
const form = document.querySelector('.order-form');

close.addEventListener('click', () => {
  modal.classList.add('hidden');
});

document.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key == 'Escape') {
    modal.classList.add('hidden');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { name, phone, comment } = e.target.elements;
  const formData = {
    name: name.value,
    phone: phone.value,
    comment: comment.value,
    modelId: '682f9bbf8acbdf505592ac36',
    color: '#1212ca',
  };

  try {
    const response = await axios.post('https://furniture-store.b.goit.study/api/orders', formData);
    const orderData = response.data;

    console.log('orderData :>> ', orderData);
    console.log(response.status);
    iziToast.show({
      message: `Ви замовили ${orderData.model}, номер замовлення ${orderData.orderNum}`,
      position: 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
    });
    modal.classList.add('hidden');
    e.target.reset();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Щось пішло не так...',
      position: 'bottomRight',
    });
    console.log(error.message);
  }
});
