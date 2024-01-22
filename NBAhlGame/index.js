let run = true;
let count = 0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function getPlayer() {
  const num = getRandomInt(7) + 1;
  const url = `https://nba-stats-db.herokuapp.com/api/playerdata/season/2023/?page=${num}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    let newNum = num;
    if (num === 7) {
      newNum = getRandomInt(9);
    } else {
      newNum = getRandomInt(100);
    }

    return data.results[newNum];
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
}

async function round() {
  const [pOne, pTwo] = await Promise.all([getPlayer(), getPlayer()]);
  document.getElementById("rightPoints").innerText = "";
  document.getElementById("leftPoints").innerText = "";

  document.getElementById("leftName").innerHTML = pOne.player_name;
  document.getElementById("rightName").innerHTML = pTwo.player_name;

  const realAns = pOne.PTS > pTwo.PTS ? 1 : 2;

  const leftButton = document.getElementById("leftbtn");
  const rightButton = document.getElementById("rightbtn");

  const promise = new Promise((resolve, reject) => {
    leftButton.addEventListener("click", resolve);
    rightButton.addEventListener("click", reject);
  });

  async function waitClick() {
    return await promise
      .then((ev) => {
        if (realAns == 1) {
          count++;
        } else {
          run = false;
        }
      })
      .catch(() => {
        if (realAns == 2) {
          count++;
        } else {
          run = false;
        }
      });
  }
  await waitClick();

  document.getElementById("sc").innerText = "Score: " + count;
  document.getElementById("rightPoints").innerText = pTwo.PTS + " PTS";
  document.getElementById("leftPoints").innerText = pOne.PTS + " PTS";

  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  await delay(1000);

  // let ans = prompt(
  //   `Who has more points in the 2023 season, ${pOne.player_name} (press 1) or ${pTwo.player_name} (press 2)`
  // );

  // while (!(ans == 1 || ans == 2)) {
  //   ans = prompt(
  //     `Try Again. Who has more points in the 2023 season, ${pOne.player_name} (press 1) or ${pTwo.player_name} (press 2)`
  //   );
  // }

  // const realAns = pOne.PTS > pTwo.PTS ? 1 : 2;
  // const isCorrect = ans == realAns ? "correct" : "incorrect";

  // run = ans == realAns;
  // if (run) {
  //   count++;
  // }

  // window.alert(
  //   `YOUR SCORE: ${count}\nYour answer was ${isCorrect}, ${pOne.player_name} has ${pOne.PTS} points, and ${pTwo.player_name} has ${pTwo.PTS} points`
  // );
}

async function main() {
  while (run) {
    await round();
    console.log(count);
    console.log(run);
  }

  window.alert(`Your final score is ${count}`);
  run = true;
  count = 0;
  document.getElementById("sc").innerText = "Score: " + count;
  document.getElementById("playbtn").style.visibility = "visible";
}

function runProgram() {
  main();
  document.getElementById("playbtn").style.visibility = "hidden";
}
