import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { abort } from "process";
import React from "react";
import { useMediaQuery } from "react-responsive";
import Rightarrow from "/public/assets/images/arrow-right-solid.svg";

const StyledContent = styled.div<{ c: number }>`
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 100%;
  @media screen and (max-width: 768px) {
    height: 650px;
  }
  background-color: ${(props) => (props.c % 2 === 0 ? "#f8f8f8" : "")};
`;

const InnerContainer = styled.div`
  display: flex;
  height: 440px;
  align-items: center;
  width: 100%;
  @media screen and (min-width: 1280px) {
    width: 70vw;
  }
  @media screen and (max-width: 1280px) {
    width: 100%;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const DescImageContainer = styled.div`
  display: flex;
  position: relative;
  width: 60%;
  height: 100%;
  @media screen and (max-width: 950px) {
    width: 100%;
    min-height: 380px;
    height: 60%;
    justify-content: center;
  }
`;

const MainContainer = styled.div`
  position: absolute;
  width: 500px;
  height: 400px;
  @media screen and (max-width: 950px) {
    width: 380px;
    height: 304px;
  }
`;

const MotionImage = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 150px;
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;
  padding: 0 30px;
  .title {
    font-size: 20px;
    font-weight: 700;
  }
  .desc {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 16px;
  }
  .link {
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 700;
    font-size: 16px;
  }
  @media screen and (max-width: 950px) {
    width: 100%;
  }
`;

export type DescriptionType = {
  id: number;
  title: string;
  description: Array<string>;
  mainImage: StaticImageData;
  imoImage: StaticImageData;
  subImage: StaticImageData;
  link?: string;
};

const Content = ({
  id,
  title,
  mainImage,
  imoImage,
  subImage,
  description,
  link,
}: DescriptionType) => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTabletOrLaptop = useMediaQuery({ query: "(min-width: 950px)" });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  return (
    <StyledContent c={id}>
      <InnerContainer>
        {id % 2 === 0 && !isTabletOrMobile && (
          <Desc>
            <div className="title">{title}</div>
            <div className="desc">
              {description.map((desc, idx) => (
                <div key={idx}>{desc}</div>
              ))}
            </div>
            {link && (
              <a href={link} className="link">
                설치형 가이드 바로가기 <Rightarrow width="16px" />
              </a>
            )}
          </Desc>
        )}
        <DescImageContainer>
          <MainContainer
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={mainImage}
              objectFit="contain"
              alt="mainImage"
              width={isTabletOrMobile ? 380 : 500}
              height={isTabletOrMobile ? 304 : 400}
            />
          </MainContainer>
          <MotionImage
            initial={{
              x: 0,
              scale: 0,
            }}
            whileInView={{
              x: 0,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            style={{
              bottom: 0,
              left: 0,
            }}
          >
            <Image
              src={subImage}
              objectFit="contain"
              alt="subImage"
              width={200}
              height={150}
            />
          </MotionImage>
          <MotionImage
            initial={{ y: 0, scale: 0 }}
            whileInView={{ y: "20%", scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            style={{ top: 0, left: "5%" }}
          >
            <Image
              src={imoImage}
              objectFit="contain"
              alt="imoImage"
              width={120}
              height={80}
            />
          </MotionImage>
        </DescImageContainer>
        {(id % 2 !== 0 || isTabletOrMobile) && (
          <Desc>
            <div className="title">{title}</div>
            <div className="desc">
              {description.map((desc, idx) => (
                <div key={idx}>{desc}</div>
              ))}
            </div>
            {link && (
              <a href={link} className="link">
                설치형 가이드 바로가기 <Rightarrow width="16px" />
              </a>
            )}
          </Desc>
        )}
      </InnerContainer>
    </StyledContent>
  );
};

export default Content;
