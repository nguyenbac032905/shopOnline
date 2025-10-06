//tính năng lọc
const buttonFilterStatus = document.querySelectorAll("[button-status]");
if (buttonFilterStatus) {
  let url = new URL(window.location.href);
  buttonFilterStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
//tinh nang tim kiem
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target[0].value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
//tinh nang phan trang
const buttonPagi = document.querySelectorAll("[button-pagination]");
if (buttonPagi) {
  let url = new URL(window.location.href);
  buttonPagi.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if (page) {
        url.searchParams.set("page", page);
      } else {
        url.searchParams.delete("page");
      }
      window.location.href = url.href;
    });
  });
}
//checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
  const inputCheckAll = document.querySelector("input[name = 'checkall']");
  const inputsId = document.querySelectorAll("input[name = 'id']");
  
  inputCheckAll.addEventListener("click",()=>{
    if(inputCheckAll.checked){
      inputsId.forEach(input => {
        input.checked = true;
      })
    }else{
      inputsId.forEach(input => {
        input.checked = false;
      })
    }
  })

  inputsId.forEach(input => {
    input.addEventListener("click", ()=>{
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
      if(countChecked == inputsId.length){
        inputCheckAll.checked = true;
      }else{
        inputCheckAll.checked = false;
      }
    })
  })
}
//form changeMulti
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit",(e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const checkedInput = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeSelected = e.target[0].value;
    if(typeSelected == "delete-all"){
      const isConfirm = confirm("bạn có chắc muốn xóa không?");
      if(!isConfirm){
        return;
      }
    }

    if(checkedInput.length > 0){
      let ids = [];
      checkedInput.forEach(input => {
        const id = input.value;
        if(typeSelected == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        }else{
          ids.push(id);
        }
      })
      const inputIds = formChangeMulti.querySelector("[name = 'ids']");
      inputIds.value = ids.join(",");
      formChangeMulti.submit();
    }else{
      alert("vui lòng chọn");
    }
  })
}
//alert
const showAlert = document.querySelector("[show-alert]");
const closeAlert = document.querySelector("[close-alert]");
if(closeAlert){
  closeAlert.addEventListener("click",() =>{
    showAlert.classList.add("alert-hidden");
  })
}
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
//upload ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const buttonDelete = document.querySelector("[delete-image-upload]");
  uploadImageInput.addEventListener("change",(e) =>{
    const file = e.target.files[0];
    uploadImagePreview.src = URL.createObjectURL(file);
  });
  buttonDelete.addEventListener("click",() => {
    uploadImageInput.value = "";
    uploadImagePreview.src = ""
  })
}