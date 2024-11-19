import './App.css';
import React, { useState } from 'react';

let nextId = 1;

// Person 클래스 정의
class Person {
  constructor(name, birthDate, gender, isDefault = false) {
    this.id = nextId++;
    this.name = name;
    this.birthDate = birthDate;
    this.gender = gender;
    this.isDefault = isDefault;
    this.spouse = null; // 배우자 정보를 저장할 속성
    this.father = null; // 아버지 참조 추가
    this.children = []; // 자식 배열 추가
  }
}

function PersonBox({
  person,
  onAddSpouse,
  onAddFather,
  onUpdatePerson,
  onDeletePerson,
}) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingInfo, setIsViewingInfo] = useState(false);
  const [name, setName] = useState(person.name);
  const [birthDate, setBirthDate] = useState(person.birthDate);
  const [gender, setGender] = useState(person.gender);

  const handleClick = (event) => {
    event.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleMenuItemClick = (action) => {
    setMenuVisible(false);
    if (action === '배우자 추가') {
      onAddSpouse(person);
    } else if (action === '아버지 추가') {
      onAddFather(person);
    } else if (action === '수정') {
      setIsEditing(true);
    } else if (action === '삭제') {
      onDeletePerson(person.id);
    } else if (action === '정보보기') {
      setIsViewingInfo(true);
    }
  };

  const handleOutsideClick = (event) => {
    event.stopPropagation();
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const handleCloseInfo = () => {
    setIsViewingInfo(false);
  };

  const handleSave = () => {
    onUpdatePerson(person.id, name, birthDate, gender);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(person.name);
    setBirthDate(person.birthDate);
    setGender(person.gender);
  };

  const boxStyle = {
    backgroundColor: person.isDefault
      ? gender === 'female'
        ? '#ff69b4'
        : '#4682b4'
      : gender === 'female'
      ? 'pink'
      : '#87ceeb',
  };

  return (
    <div className="person-box" onClick={handleOutsideClick} style={boxStyle}>
      {isEditing ? (
        <div className="edit-form-box">
          <input
            className="edit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
          />
          <input
            className="edit-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="생년월일"
          />
          <select
            className="edit-select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
          <div className="edit-buttons">
            <button className="save-button" onClick={handleSave}>
              저장
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
          </div>
        </div>
      ) : isViewingInfo ? (
        <div className="info-box">
          <div>이름: {person.name}</div>
          <div>생년월일: {person.birthDate}</div>
          <div>성별: {person.gender === 'male' ? '남자' : '여자'}</div>
          <div>ID: {person.id}</div>
          {person.spouse && (
            <div>
              배우자: {person.spouse.id}, {person.spouse.name}
            </div>
          )}
          <button className="close-info-button" onClick={handleCloseInfo}>
            닫기
          </button>
        </div>
      ) : (
        <>
          <div className="name">{person.name}</div>
          <div className="birthdate">{person.birthDate}</div>
          <button className="menu-button" onClick={handleClick}>
            ⋮
          </button>
          {menuVisible && (
            <div className="menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleMenuItemClick('정보보기')}>
                정보보기
              </button>
              {!person.spouse && (
                <button onClick={() => handleMenuItemClick('배우자 추가')}>
                  배우자 추가
                </button>
              )}
              <button onClick={() => handleMenuItemClick('아버지 추가')}>
                아버지 추가
              </button>
              <button onClick={() => handleMenuItemClick('수정')}>수정</button>
              {!person.isDefault && (
                <button onClick={() => handleMenuItemClick('삭제')}>
                  삭제
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function App() {
  const [people, setPeople] = useState([
    new Person('홍길동', '2024-01-01', 'male', true),
  ]);

  const addSpouse = (currentPerson) => {
    const spouseGender = currentPerson.gender === 'male' ? 'female' : 'male';
    const spouse = new Person('배우자', '2024-01-02', spouseGender, false);

    // 서로의 배우자 정보 설정
    spouse.spouse = currentPerson;
    currentPerson.spouse = spouse;

    if (currentPerson.gender === 'male') {
      // 남자일 경우 여자를 오른쪽에 추가
      setPeople((prevPeople) => {
        const index = prevPeople.findIndex((p) => p.id === currentPerson.id);
        return [
          ...prevPeople.slice(0, index + 1),
          spouse,
          ...prevPeople.slice(index + 1),
        ];
      });
    } else {
      // 여자일 경우 남자를 왼쪽에 추가
      setPeople((prevPeople) => {
        const index = prevPeople.findIndex((p) => p.id === currentPerson.id);
        return [
          ...prevPeople.slice(0, index),
          spouse,
          ...prevPeople.slice(index),
        ];
      });
    }
  };

  const updatePerson = (id, newName, newBirthDate, newGender) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) => {
        if (person.id === id) {
          person.name = newName;
          person.birthDate = newBirthDate;
          person.gender = newGender;
          // 배우자가 있다면 배우자의 정보도 업데이트
          if (person.spouse) {
            person.spouse.spouse = person;
          }
        }
        return person;
      })
    );
  };

  const deletePerson = (id) => {
    setPeople((prevPeople) => {
      const personToDelete = prevPeople.find((p) => p.id === id);
      if (personToDelete && personToDelete.spouse) {
        // 배우자의 spouse 참조 제거
        personToDelete.spouse.spouse = null;
      }
      return prevPeople.filter((person) => person.id !== id);
    });
  };

  const addFather = (currentPerson) => {
    const father = new Person('아버지', '1970-01-01', 'male', false);
    father.children = [currentPerson];
    currentPerson.father = father;

    setPeople((prevPeople) => {
      const index = prevPeople.findIndex((p) => p.id === currentPerson.id);
      const newPeople = [...prevPeople];
      // 현재 인물의 위치에 아버지를 추가하고 나머지를 아래로 이동
      newPeople.splice(index, 0, father);
      return newPeople;
    });
  };

  return (
    <div className="app-container">
      <div className="family-tree">
        {people.map((person, index) => (
          <div key={person.id} className="person-container">
            <PersonBox
              person={person}
              onAddSpouse={addSpouse}
              onAddFather={addFather}
              onUpdatePerson={updatePerson}
              onDeletePerson={deletePerson}
            />
            {index < people.length - 1 &&
              person.gender === 'male' &&
              people[index + 1].gender === 'female' && (
                <div className="spouse-connection-line" />
              )}
            {person.father && <div className="parent-child-line" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
