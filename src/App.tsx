import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";

interface Info {
  id: number;
  name: string;
  age: number;
}

function App() {
  const [infoArray, setInfoArray] = useState<Info[]>([]);
  const page = useRef(1);
  const observerRef = useRef<IntersectionObserver>();
  const boxRef = useRef(null);

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(intersectionObserver);
    boxRef.current && observerRef.current.observe(boxRef.current);
  }, [infoArray]);

  const getInfo = async () => {
    console.log(page, "요청");
    const res = await axios.get(
      `http://localhost:8080/info?_page=${page.current}`
    );
    setInfoArray((curInfoArray) => [...curInfoArray, ...res.data]); // state에 추가
  };

  // IntersectionObserver 설정. 콜백함수
  const intersectionObserver = (
    entries: IntersectionObserverEntry[],
    io: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      // 관찰하고 있는 entry가 화면에 보여지는 경우
      if (entry.isIntersecting) {
        // entry 관찰 해제
        io.unobserve(entry.target);
        // 다음 페이지 데이터 가져오기 (+10개씩)
        if (page.current < 4) {
          page.current += 1;
          getInfo();
        }
      }
    });
  };

  // style
  const Wrapper = styled.ul`
    list-style: none;
    width: 800px;
    margin: 0 auto;
    padding: 0;
  `;

  const Box = styled.li`
    border-radius: 15px;
    box-shadow: 3px 3px 15px rgb(0 0 0 / 20%);
    margin: 40px 0;
  `;

  const Element = styled.p`
    margin: 0;
    padding: 0;
  `;

  const Title = styled.span`
    display: inline-block;
    font-weight: 700;
    margin: 15px 25px;
  `;

  return (
    <Wrapper>
      {infoArray.map((info, index) => {
        // 아래에서 2번째에 해당하는 박스가 isIntersecting 될 때
        if (infoArray.length - 2 === index) {
          return (
            <Box key={index} ref={boxRef}>
              <Element>
                <Title>아이디</Title>
                <span>{info.id}</span>
              </Element>
              <Element>
                <Title>이름</Title>
                <span>{info.name}</span>
              </Element>
              <Element>
                <Title>나이</Title>
                <span>{info.age}</span>
              </Element>
            </Box>
          );
        } else {
          // 나머지 관찰되는 요소가 없는 html (25 > 1 > 4)
          return (
            <Box key={index}>
              <Element>
                <Title>아이디</Title>
                <span>{info.id}</span>
              </Element>
              <Element>
                <Title>이름</Title>
                <span>{info.name}</span>
              </Element>
              <Element>
                <Title>나이</Title>
                <span>{info.age}</span>
              </Element>
            </Box>
          );
        }
      })}
    </Wrapper>
  );
}

export default App;
