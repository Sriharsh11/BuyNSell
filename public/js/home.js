/*----------------------Email Verification--------------------*/

// $(document).ready(function(){
//     var from,to,subject,text;
//     $("#send_email").click(function(){
//         to=$("#to").val();
//         $("#message").text("Sending E-mail...Please wait");
//         $.get("http://localhost:3000/send",{to:to},function(data){
//         if(data=="sent")
//         {
//             $("#message").empty().html("<p>Email is been sent at "+to+" . Please check inbox !</p>");
//         }
//
// });
//     });
// });


/*---------------College List-----------------*/

var input, filter, ul, li, a, i;
input = document.getElementById("searchbar");
ul = document.getElementById("collegeList");
clgList = ul.getElementsByTagName("li");

function searchCollege()
{
  filter = input.value.toUpperCase();
  for (i = 0; i < clgList.length; i++)
  {
      if (clgList[i].innerHTML.toUpperCase().indexOf(filter) > -1)
          clgList[i].style.display = "";
      else
          clgList[i].style.display = "none";
  }
}

/*---------------addEventListener-----------------*/

for (i = 0; i < clgList.length; i++)
{
  clgList[i].addEventListener('click',function(){
          input.value = this.innerHTML;
      }
  );
}

function removeCollegeList()
{
  document.getElementById('searchbar').value='';
  for (i = 0; i < clgList.length; i++)
  {
      clgList[i].style.display="";
  }
}
