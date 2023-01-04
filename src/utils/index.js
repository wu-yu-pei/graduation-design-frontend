// 判断是白天还是黑夜
export function isDaylight() {
  var currdate = new Date();
  if (currdate.getHours() >= 17 || currdate.getHours() < 7) {
    return false;
  } else {
    return true;
  }
}
