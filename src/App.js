import "./App.css";
import CardData from "./CardData";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import React, { useEffect, useState } from "react";

function App() {
  const [cardList, setCardlist] = useState(CardData);
  const [result, setResult] = useState([]);

  useEffect(() => {
    setCardlist(CardData);
  }, []);

  const dividedCardData = (arr, num) => {
    const shuffled = [];
    for (let i = 0; i < num; ) {
      const random = Math.floor(Math.random() * arr.length);
      shuffled.push(arr[random]);
      arr.splice(arr.indexOf(arr[random]), 1);
      i++;
    }
    return shuffled;
  };
  const firstList = dividedCardData(CardData, 13);
  const secondlist = dividedCardData(CardData, 12);
  const thirdList = dividedCardData(CardData, 11);

  const columnsInfo = [
    { id: 1, name: "first-column", items: firstList },
    { id: 2, name: "second-column", items: secondlist },
    { id: 3, name: "third-column", items: thirdList },
  ];
  const [columns, setColumn] = useState(columnsInfo);

  const onDragEnd = (result, columns, setColumn) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumn({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumn({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  const checkResult = () => {
    const winningRuleArr = [
      "bi bi-cloud-sun",
      "bi bi-brightness-high",
      "bi bi-sunset",
      "bi bi-9-circle",
      "bi bi-8-circle",
      "bi bi-7-circle",
      "bi bi-6-circle",
      "bi bi-5-circle",
      "bi bi-4-circle",
      "bi bi-3-circle",
      "bi bi-2-circle",
      "bi bi-1-circle",
    ];
    const objectList = columns.map((column) => column.items);
    let symArr = [];
    for (let i = 0; i < objectList.length; i++) {
      const symbols = objectList[i].map((item) => item.symbol);
      symArr.push(symbols);
    }
    const str1 = [];
    const str2 = [];
    for (let x = 0; x < symArr.length; x++) {
      str1.push(symArr[x].join(""));
      str2.push(winningRuleArr.join(""));
    }
    if (str1.join("") === str2.join("")) {
      return setResult([true]);
    } else {
      return setResult([false]);
    }
  };

  return (
    <div className="App">
      <div className="columns-container">
        <h2 className="rule">
          Game Rule
          <span>
            <p className="ruletext">
              <i className="bi bi-cloud-sun" />-
              <i className="bi-brightness-high" />-<i className="bi-sunset" />
              -9-8-7-6-5-4-3-2-1
            </p>
          </span>
        </h2>
        <div className="columns-items">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumn)}
          >
            {Object.entries(columns).map(([columnId, column], index) => (
              <Droppable droppableId={columnId} key={columnId} index={index}>
                {(provider) => (
                  <div
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                    className={column.name}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        draggableId={item.id.toString()}
                        key={item.id}
                        index={index}
                      >
                        {(provider) => (
                          <div
                            ref={provider.innerRef}
                            {...provider.dragHandleProps}
                            {...provider.draggableProps}
                            className="card-item"
                          >
                            <i className={item.symbol}></i>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provider.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
        <button onClick={checkResult}>Check</button>
        <div className="result-container">
          {result.map((element) => {
            if (element === true) {
              return <h1>Winner !</h1>;
            } else {
              return <h1>Try Again !</h1>;
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
