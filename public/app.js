if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function () {
        console.log("Service worker registered!");
      })
      .catch(function (e) {
        console.error("SW Errors while registering!", e);
      });
  });
}

async function Errorsweet(message) {
  Swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 3500,
  });
}

async function Successsweet(message) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3500,
  });
}

const app = Vue.createApp({
  data() {
    return {
      matches: null,
      users: null,
      userLogin: null,
      predictionsList: null,
      allPredictionsList: null,
      allNoPredictions: null,
      results: null,
      title: "",
      pass: "",
      indexOfPrediction: 0,
      userNameShow: "",
      addd: "https://smhm.azurewebsites.net",
      allow: false,
    };
  },
  methods: {
    async Login() {
      this.userLogin = null;
      if (isNaN(this.pass)) {
        Errorsweet("Please Provide the input as a number");
        return false;
      }

      if (this.pass.trim() == "") {
      } else {
        const btnLog = document.querySelector("#btnLogin");
        btnLog.innerHTML = "Please Wait...";
        btnLog.disabled = true;
        await fetch(this.addd + "/api/User/" + this.pass)
          .then((res) => res.json())
          .then((data) => (this.userLogin = data))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));

        if (this.userLogin.id == -1) {
          this.allow = false;
          Errorsweet("Incorrect PIN");
        } else {
          this.allow = true;
        }
        this.pass = "";
        btnLog.innerHTML = "Login";
        btnLog.disabled = false;
        console.log(this.userLogin);
      }
    },
    selectedText(index) {
      if (this.allow) {
        console.log(index);
      }
    },
    async getMatch() {
      if (this.allow) {
        this.allNoPredictions = null;
        this.allPredictionsList = null;
        await fetch(this.addd + "/api/Match")
          .then((res) => res.json())
          .then((data) => (this.matches = data))
          .then(console.log(this.matches))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getPredictions() {
      if (this.allow) {
        this.allPredictionsList = null;
        await fetch(this.addd + "/api/predictions/" + this.userLogin.id)
          .then((res) => res.json())
          .then((data) => (this.predictionsList = data))
          .then(console.log(this.predictionsList))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getHistoryPredictions() {
      if (this.allow) {
        this.allPredictionsList = null;
        await fetch(this.addd + "/api/HistoryPredictions/" + this.userLogin.id)
          .then((res) => res.json())
          .then((data) => (this.predictionsList = data))
          .then(console.log(this.predictionsList))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getUsers() {
      if (this.allow) {
        await fetch(this.addd + "/api/User")
          .then((res) => res.json())
          .then((data) => (this.users = data))
          .then(console.log(this.users))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getResults() {
      if (this.allow) {
        await fetch(this.addd + "/api/Result")
          .then((res) => res.json())
          .then((data) => (this.results = data))
          .then(console.log(this.results))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getAllPredictions(index) {
      if (this.allow) {
        console.log(index);
        console.log(this.predictionsList[index].matchId);
        this.indexOfPrediction = index;
        await fetch(
          this.addd +
            "/api/AllPredictions/" +
            this.predictionsList[index].matchId
        )
          .then((res) => res.json())
          .then((data) => (this.allPredictionsList = data))
          .then(console.log(this.allPredictionsList))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getAllPredictionsForSet(index) {
      if (this.allow) {
        console.log(index);
        await fetch(this.addd + "/api/AllPredictions/" + index)
          .then((res) => res.json())
          .then((data) => (this.allPredictionsList = data))
          .then(console.log(this.allPredictionsList))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async getAllNoPredictions(index) {
      if (this.allow) {
        console.log(index);
        await fetch(this.addd + "/api/GetAllNoPredictions/" + index)
          .then((res) => res.json())
          .then((data) => (this.allNoPredictions = data))
          .then(console.log(this.allNoPredictions))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
      }
    },
    async UpdatePredictions(index) {
      if (this.allow) {
        await console.log("#b" + this.predictionsList[index].id);
        const btnSend = document.querySelector(
          "#b" + this.predictionsList[index].id
        );
        btnSend.innerHTML = "Sending...";
        btnSend.disabled = true;

        let _data = this.predictionsList[index];
        let _res = "";
        console.log(_data);
        console.log(
          this.addd + "/api/Predictions/" + this.predictionsList[index].id
        );
        await fetch(
          this.addd + "/api/Predictions/" + this.predictionsList[index].id,
          {
            method: "PUT",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          }
        )
          .then((response) => console.log(response))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));

        this.predictionsList[index].done = true;
        btnSend.innerHTML = "Updated";
        btnSend.disabled = false;
        Successsweet("Prediction updated.");
      }
    },
    async ConfirmUpdateAllPredictions() {
      if (this.allow) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Update it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.UpdateAllPredictions();
          }
        });
      }
    },
    async UpdateAllPredictions() {
      if (this.allow) {
        const btnSend = document.querySelector("#btnAllUpdate");
        btnSend.innerHTML = "Sending...";
        btnSend.disabled = true;

        let _data = this.allPredictionsList;
        let _res = "";
        console.log(_data);
        await fetch(this.addd + "/api/allPredictions/" + 1, {
          method: "PUT",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then((response) => console.log(response))
          .catch((err) => Errorsweet("Check your Internet Conncetion"));
        this.allPredictionsList = null;
        this.predictionsList[index].done = true;
        btnSend.innerHTML = "Updated";
        btnSend.disabled = false;
      }
    },
    async ConfirmUpdateMatch(index) {
      if (this.allow) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Update it!",
        }).then((result) => {
          if (result.isConfirmed) {
            this.UpdateMatch(index);
          }
        });
      }
    },
    async UpdateMatch(index) {
      if (this.allow) {
        await console.log("#bm" + this.matches[index].id);
        const btnSend = document.querySelector("#bm" + this.matches[index].id);
        btnSend.innerHTML = "Sending...";
        btnSend.disabled = true;
        this.matches[index].team1Id = this.userLogin.id;
        let _data = this.matches[index];
        let _res = "";
        console.log(_data);
        console.log(this.addd + "/api/match/" + this.matches[index].id);
        await fetch(this.addd + "/api/match/" + this.matches[index].id, {
          method: "PUT",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then((response) => console.log(response))
          .catch((err) => console.log(err));

        btnSend.innerHTML = "Updated";
        btnSend.disabled = false;
        Successsweet("Match updated.");
      }
    },
  },
  computed: {},
});

app.mount("#app");
