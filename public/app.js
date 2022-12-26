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
      inputText: null,
      sentences: null,
      index: 0,
      shuffledSentenceSelected: null,
      SenteceInput: "",
      isCorrect: false,
      isUncorrect: false,
      isImport: true,
      isDone: false,
      isImportSentences: true,
      sentenceCount: 0,
    };
  },
  methods: {
    async start() {

      if(this.inputText==null)
      {
        Errorsweet("Insert Text");
        return;
      }

      if(this.inputText.trim()=='')
      {
        Errorsweet("Insert Text");
        return;
      }


      const lines = this.inputText.split("<br>");
      console.log(lines);
      const Words = lines[0].replace("\n", " \n ");
      console.log(Words);
      this.sentences = Words.split("\n");
      console.log(this.sentences);
      this.sentenceCount = this.sentences.length;
      console.log("lenght is " + this.sentenceCount);
      this.isDone = false;
      this.isImport = true;
      this.isCorrect = false;
      this.isUncorrect = false;
      this.SenteceInput = "";
      this.index = 0;
      this.isImportSentences = false;
      this.practice();
    },
    async practice() {
      const sen1 = this.sentences[this.index].split(" ");
      const sen2=sen1.sort((a, b) => 0.5 - Math.random());
      this.shuffledSentenceSelected = sen2.filter(e => String(e).trim());
      console.log(this.shuffledSentenceSelected);

      // const shuffleArray = array => {
      //   for (let i = array.length - 1; i > 0; i--) {
      //     const j = Math.floor(Math.random() * (i + 1));
      //     const temp = array[i];
      //     array[i] = array[j];
      //     array[j] = temp;
      //   }
      // }
    },
    async addWord(word) {
      this.SenteceInput = this.SenteceInput + " " + word;
    },
    async checkSentece() {
      const btnLog = document.querySelector("#btnMain");

      if (this.isCorrect) {
        if (this.isDone) {
          this.isImportSentences = true;
          return;
        }
        this.index = this.index + 1;

        if (this.index > this.sentenceCount - 1) {
          btnLog.innerHTML = "Done";
          this.isDone = true;
          return;
        }

        this.practice();
        this.isCorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
      } else if (this.isUncorrect) {
        this.practice();
        this.isUncorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
      } else {
        if (
          this.SenteceInput.replace(/\s/g, "") ===
          this.sentences[this.index].replace(/\s/g, "")
        ) {
          this.isCorrect = true;
          this.isImport = false;
          btnLog.innerHTML = "Next";
        } else {
          this.isUncorrect = true;
          this.isImport = false;
          console.log(this.SenteceInput.replace(/\s/g, ""));
          console.log(this.sentences[this.index].replace(/\s/g, ""));
          btnLog.innerHTML = "Try Again";
        }
      }
    },
    async showAnswer() {
      const toastTrigger = document.getElementById("liveToastBtn");
      const toastLiveExample = document.getElementById("liveToast");
      if (toastTrigger) {
        toastTrigger.addEventListener("click", () => {
          const toast = new bootstrap.Toast(toastLiveExample);

          toast.show();
        });
      }
    },
  },
  computed: {},
});

app.mount("#app");


window.onload = function() {
  var delayInMilliseconds = 3000; 
setTimeout(function() {
  document.querySelector("#container").style.display='flex';
  document.querySelector("#overlay").style.display='none';  
}, delayInMilliseconds);

};