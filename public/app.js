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

function copyToClipboard(id) {
  var from = document.getElementById(id);
  var range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(from);
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
}

const app = Vue.createApp({
  data() {
    return {
      inputText: null,
      sentences: null,
      index: 0,
      shuffledSentenceSelected: null,
      SenteceInput: "",
      currentAnswer: "",
      isCorrect: false,
      isUncorrect: false,
      isImport: true,
      isDone: false,
      isImportSentences: true,
      isQuestion: false,
      isSearchQuestion: false,
      sentenceCount: 0,
      takeSentenceNum:100,
      currentQuestion:'',
      currentAnswer:'',
      ShowTheAnswer:false,
      indexQuestion:0,
      Questions:[],
      textForSearchQuestion: "",
      QuestionsSearchList:[],
      QuestionsCount: 0,
      file:null,
      content: null,
    };
  },
  methods: {
    readFile: function() {
      this.file = this.$refs.doc.files[0];
      const reader = new FileReader();
      if (this.file.name.includes(".txt")) {
        reader.onload = (res) => {
          if(this.content==null){
            this.content = res.target.result;
          }
          else{
            this.content =this.content + "\r\n\r\n"+res.target.result;
          }
          
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      } else {
        this.content = "check the console for file output";
        reader.onload = (res) => {
          console.log(res.target.result);
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.file);
      }
     
      
    },
    async start() {
      if (this.content == null) {
        Errorsweet("Insert Text");
        return;
      }

      if (this.content.trim() == "") {
        Errorsweet("Insert Text");
        return;
      }

      const chkbox=document.querySelector('#chkQuestion');
      const chkbox2=document.querySelector('#chkSearch');
      if(chkbox.checked==true||chkbox2.checked==true)
      {       
        this.Questions=[];
        this.indexQuestion=0;
        this.isDone=false;
        this.ShowTheAnswer=false;
        this.isSearchQuestion=false;
        const ques=this.content.split("<br>");
        console.log(ques);
        const tempp=ques[0].split("\r\n");
        console.log(tempp);

         this.Questions=[];
        let q='';
        let answer='';

        for (let item=0;item<=tempp.length;item++)
        {
          if(tempp[item]==""|| item==tempp.length)
          {
            if(q.trim()!="")
            {this.Questions.push({
              id:item,
              qu:q,
              ans:answer
            });}

            q='';
            answer='';
          }
          if(item!=tempp.length){
            if(tempp[item].indexOf("*")!=-1){
              
            }
            else{

              if(q=='')
              {
                q=tempp[item];
              }
              else{
                answer=answer+tempp[item]+'\n';
              }
    
            }
          }          
        }
        if(chkbox2.checked==true){
          this.Questions = this.Questions;
        }
        else{
          this.Questions = this.shuffleArray(this.Questions).slice(0,this.takeSentenceNum);
        }
       
        this.currentQuestion=this.Questions[this.indexQuestion].qu;
        this.currentAnswer=this.Questions[this.indexQuestion].ans;
        this.isImportSentences = false;
        this.isQuestion=true;
        this.QuestionsCount = this.Questions.length;
       
        console.log(this.QuestionsCount );

      }
      else{        
        const lines = this.content.split("<br>");
        const Words = lines[0].replace("\n", " \n ");
        const temp=Words.split("\n");
        const temp2 = temp.filter((e) => String(e).trim());
        this.sentences = this.shuffleArray(temp2).slice(0,this.takeSentenceNum);
        this.sentenceCount = this.sentences.length;
        this.isQuestion=false;
        this.isDone = false;        
        this.isCorrect = false;
        this.isUncorrect = false;
        this.SenteceInput = "";        
        this.isImportSentences = false;
        this.practice();
      }
      this.index = 0;
      this.isImport = true;

    },
    shuffleArray: function(array) {

      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
         const temp = array[i];
       array[i] = array[j];
         array[j] = temp;
      }    
     
     return array;
  },
    async practice() {
      this.currentAnswer=this.sentences[this.index];
      const sen1 = this.currentAnswer.split(" ");
      const sen2 = this.shuffleArray(sen1);
      this.shuffledSentenceSelected = sen2.filter((e) => String(e).trim());
    },
    async addWord(word, btnNum) {
      this.SenteceInput = this.SenteceInput + " " + word;
      document.querySelector(btnNum).disabled = true;
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
          document.querySelector("#btnRest").style.display = "none";
          return;
        }

        this.practice();
        this.isCorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
        this.deselectButtons();
        document.querySelector("#btnRest").disabled = false;
      } else if (this.isUncorrect) {
        this.practice();
        this.isUncorrect = false;
        this.isImport = true;
        this.SenteceInput = "";
        btnLog.innerHTML = "Check";
        this.deselectButtons();
        document.querySelector("#btnRest").disabled = false;
      } else {
        if (
          this.SenteceInput.replace(/\s/g, "") ===
          this.currentAnswer.replace(/\s/g, "")
        ) {
          this.isCorrect = true;
          this.isImport = false;
          btnLog.innerHTML = "Next";
          document.querySelector("#btnRest").disabled = true;
        } else {
          this.isUncorrect = true;
          this.isImport = false;
          document.querySelector("#btnRest").disabled = true;
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
    async deselectButtons() {

      for (let i = 0; i < this.shuffledSentenceSelected.length; i++) {
        document.querySelector("#btn" + i).disabled = false;
      }
    },
    async resetAnswer() {
      this.deselectButtons();
      this.SenteceInput="";
    },
    async exitApp(){
      if(this.isImportSentences){
        window.close();
      }
      else{
        this.isImportSentences=true;
      }
      document.getElementById("btncloseModal").click();
    },
    async btnQuestion(){
      if(this.ShowTheAnswer){
       
        if(this.indexQuestion==this.QuestionsCount-1)
        {         
          this.isDone=true;
          return;
        }
        document.getElementById('btnQuestion').innerText="Answer";
        this.ShowTheAnswer=false;
        this.indexQuestion=this.indexQuestion+1;
        this.currentQuestion=this.Questions[this.indexQuestion].qu;
        this.currentAnswer=this.Questions[this.indexQuestion].ans;
        if(chkboxPlaySound.checked==true)
        {
          responsiveVoice.speak(this.currentQuestion.split("(")[0], "US English Male");
          console.log("paly sound");
        }
        this.index = this.index + 1;
      }
      else{
       document.getElementById('btnQuestion').innerText="Next";
        this.ShowTheAnswer=true;
       
      }
      
    },
  },
  computed: {
    InputSentenceCount: function() {
      let Num=0;
      if(this.content!=null)
      {
        const lines = this.content.split("<br>");
        const Words = lines[0].split("\n");
        const temp2 = Words.filter((e) => String(e).trim());
        Num=temp2.length;
      }
      return Num;
  },
  InsertInputFormFile: function() {
    let Num=0;
    if(this.content!=null)
    {      
      return this.content;     
    }
    return "";
},
  searchResult() {

    let templist = this.Questions;

    if (this.textForSearchQuestion.trim() != '' && this.textForSearchQuestion) {
      let templist2 = templist.slice(1, 3);
      let xxx = this.textForSearchQuestion.toUpperCase().split(" ");

      for (i = 0; i < xxx.length; i++) {
          templist2 = [];
          templist2 = templist.filter((item) => {
              return item.qu
                  .toUpperCase()
                  .includes(xxx[i].toUpperCase()) ||item.ans
                  .toUpperCase()
                  .includes(xxx[i].toUpperCase())
          });
          templist = [];
          templist = templist2;
      }
      return templist;
    }
    else{
      return [];
    }

    
  }
  },
});

app.mount("#app");

window.onload = function () {
  var delayInMilliseconds = 3000;
  setTimeout(function () {
    document.querySelector("#container").style.display = "flex";
    document.querySelector("#overlay").style.display = "none";
  }, delayInMilliseconds);
};
