import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";

type ItemCarouselProps = {
  bigItems: React.ReactElement[];
  smallItems: React.ReactElement[];
  mainTitle: string;
  title1: string;
  title2: string;
};

function ItemCarousel({
  bigItems,
  smallItems,
  mainTitle,
  title1,
  title2,
}: ItemCarouselProps) {
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);
  const [nav1, setNav1] = useState<Slider | undefined>(undefined);
  const [nav2, setNav2] = useState<Slider | undefined>(undefined);

  useEffect(() => {
    setNav1(sliderRef1.current || undefined);
    setNav2(sliderRef2.current || undefined);
  }, []);

  if (bigItems.length < 3) return null;

  function BigItem({ item }: { item: React.ReactElement }) {
    return (
      <Box
        sx={{
          minWidth: "300px",
          minHeight: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Box>{item}</Box>
      </Box>
    );
  }

  function SmallItem({ item }: { item: React.ReactElement }) {
    return (
      <Box
        sx={{
          minWidth: "100px",
          minHeight: "70px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Box>{item}</Box>
      </Box>
    );
  }

  return (
    <Box className="slider-container">
      <Typography
        component={"h2"}
        sx={{ textAlign: "center", fontSize: "30px", marginBottom: "10px" }}
      >
        {mainTitle}
      </Typography>
      <Typography
        component={"h4"}
        sx={{ textAlign: "center", fontSize: "24px", marginBottom: "5px" }}
      >
        {title1}
      </Typography>
      <Slider asNavFor={nav2} ref={sliderRef1}>
        {bigItems.map((item, index) => {
          return (
            <Box key={index}>
              <BigItem item={item} />
            </Box>
          );
        })}
      </Slider>
      <Typography
        component={"h4"}
        sx={{
          textAlign: "start",
          fontSize: "18px",
          marginBottom: "30px",
        }}
      >
        {title2}
      </Typography>
      <Slider
        asNavFor={nav1}
        ref={sliderRef2}
        slidesToShow={3}
        swipeToSlide={true}
        focusOnSelect={true}
      >
        {smallItems.map((item, index) => {
          return (
            <Box key={index}>
              <SmallItem item={item} />
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
}

export default ItemCarousel;
