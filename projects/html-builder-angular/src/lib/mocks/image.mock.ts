export const getImageList = (length = 10) => Array.from({ length }).map((item, i) => `200/300?image=${(i + 1) % 16}`);
