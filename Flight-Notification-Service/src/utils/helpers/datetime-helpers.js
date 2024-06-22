function compartTime(timestring1, timestring2) {
  let d1 = new Date(timestring1);
  let d2 = new Date(timestring2);

  return d1.getTime() > d2.getTime();
}

module.exports = {
  compartTime,
};
