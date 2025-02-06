import React, { useState, useEffect } from 'react';
import styles from './style.css';

const App = () => {
    const [seminars, setSeminars] = useState([]);
    const [showModal, setShowModal] = useState(false); // Для отображения модального окна
    const [currentSeminar, setCurrentSeminar] = useState(null); // Для текущего редактируемого семинара

    useEffect(() => {
        fetch('http://localhost:3001/seminars')
            .then(response => response.json())
            .then(data => setSeminars(data)); // предполагается, что data это массив семинаров
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:3001/seminars/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setSeminars(seminars.filter(seminar => seminar.id !== id));
            })
            .catch((error) => console.error('Ошибка при удалении:', error));
    };

    const handleEdit = (seminar) => {
        setCurrentSeminar(seminar);
        setShowModal(true); // Открытие модального окна
    };

    const handleModalClose = () => {
        setShowModal(false);
        setCurrentSeminar(null); // Закрытие модального окна
    };

    const handleSave = () => {
        fetch(`http://localhost:3001/seminars/${currentSeminar.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentSeminar),
        })
            .then(response => response.json())
            .then(() => {
                setSeminars(seminars.map(seminar =>
                    seminar.id === currentSeminar.id ? currentSeminar : seminar
                ));
                handleModalClose(); // Закрыть модальное окно после сохранения
            })
            .catch((error) => console.error('Ошибка при сохранении:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSeminar(prevSeminar => ({
            ...prevSeminar,
            [name]: value,
        }));
    };

    return (
        <div>
            <h1>Семинары</h1>
            <ul>
                {seminars.map(seminar => (
                    <li key={seminar.id}>
                        <h2>{seminar.title}</h2>
                        <p>{seminar.description}</p>
                        <img src={seminar.photo} alt={seminar.title} width="200" />
                        <button onClick={() => handleDelete(seminar.id)}>Удалить</button>
                        <button onClick={() => handleEdit(seminar)}>Редактировать</button>
                    </li>
                ))}
            </ul>

            {showModal && currentSeminar && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Редактировать семинар</h2>
                        <label>
                            Название:
                            <input
                                type="text"
                                name="title"
                                value={currentSeminar.title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Описание:
                            <input
                                type="text"
                                name="description"
                                value={currentSeminar.description}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <label>
                            Фото URL:
                            <input
                                type="text"
                                name="photo"
                                value={currentSeminar.photo}
                                onChange={handleInputChange}
                            />
                        </label>
                        <br />
                        <button onClick={handleSave}>Сохранить</button>
                        <button onClick={handleModalClose}>Закрыть</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;