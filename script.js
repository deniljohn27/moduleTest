
// let url="https://api.ipify.org?format=json";
let address=document.getElementById("ipAddress1");
let btn=document.getElementById("getData");
let map=document.getElementById("map");
let page1=document.getElementById("page1");
let page2=document.getElementById("page2");
btn.addEventListener("click",show);
let ipAddress="";
function getUserInfo(){
    fetch("https://api.ipify.org/?format=json")
        .then((res) => res.json())
        .then((data) => {
         ipAddress=data.ip;
         address.innerText=ipAddress;
        }).catch(()=>{
            ipAddress="24.239.131.31";
            address.innerText=ipAddress;
        })
        // ipAddress=data.ip;//"157.40.189.24";
        //  address.innerText=ipAddress;
    }
function show(){  
        page1.style.display="none";
        page2.style.display="block";     
        fetch(`https://ipinfo.io/${ipAddress}?token=a65aa5704d8782`)
        .then((response) => response.json())
        .then((data) => {
          const ip = data.ip;
          const lat = data.loc.split(",")[0];
          const lon = data.loc.split(",")[1];
          const timezone = data.timezone;
          const pincode = data.postal;
          document.getElementById("timez").innerText=timezone;
          document.getElementById("date").innerText=new Date().toLocaleString("en-US", `{ timeZone: ${timezone }`);
          document.getElementById("pin").innerText=pincode;
           
          showLocationOnMap(lat, lon, data);
          getPostOffices(pincode);

          console.log(data);
        })    
}



function showLocationOnMap(lat, lon, data){
    document.getElementById("ipAddress2").innerText= data.ip;
    document.getElementById("lat").innerText=lat;
    document.getElementById("long").innerText= lon;
    document.getElementById("city").innerText=data.city;
    document.getElementById("region").innerText=data.region;
    document.getElementById("organisation").innerText=data.org; 

 let iframe=document.createElement("iframe");
 iframe.src=`https://maps.google.com/maps?q=${lat}, ${lon}&z=15&output=embed`;
 map.append(iframe);
}

let search=document.getElementById("search");
search.addEventListener("input",()=>{filter(postOfficeArray)})
let postOfficeArray=[];
function getPostOffices(pincode){
    
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((res) => res.json())
    .then((data) => {
        document.getElementById("message").innerText=data[0].Message;
        
        postOfficeArray=data[0].PostOffice;
        // console.log(postOfficeArray);
        postOffice(postOfficeArray);
    
    });
}

function filter(postArray){
 
    let arr=postArray.filter((ele)=>{
        return ele.Name.toLowerCase().includes(search.value.toLowerCase())||ele.BranchType.toLowerCase().includes(search.value.toLowerCase());
    });
    
    if(arr.length==0){
        // alert("No Data Found");
    }else{
        postOffice(arr);
    }

}
function postOffice(postOfficeArray){
    let container=document.getElementById("container");
    container.innerText=" ";
    for(let i=0;i<postOfficeArray.length;i++){
        let name=postOfficeArray[i].Name;
        let brach=postOfficeArray[i].BranchType;
        let status=postOfficeArray[i].DeliveryStatus;
        let district=postOfficeArray[i].District;
        let division=postOfficeArray[i].Division;

        let post=document.createElement("div");
        post.className="post";
        post.innerHTML=`
        <div class=""><p>Name: <span id="name">${name}</span></div>
        <div class=""><p>Branch Type: <span id="branch">${brach}</span></div>
        <div class=""><p>Delivery Status: <span id="status">${status}</span></div>
        <div class=""><p>District: <span id="district">${district}</span></div>
        <div class=""><p>Division: <span id="division">${division}</span></div>  
        `
        container.append(post);
    }
}
getUserInfo();