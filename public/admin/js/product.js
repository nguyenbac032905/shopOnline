//change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonChangeStatus.forEach((button) => {

    button.addEventListener("click", () => {

      const currentStatus = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      let changedStatus = currentStatus=="active" ? "inactive":"active";
      const action = `${path}/${changedStatus}/${id}/?_method=PATCH`;
      console.log(action);
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
//delete cứng
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete){
  const formDeleteProduct = document.querySelector("#form-delete-product");
  const path = formDeleteProduct.getAttribute("data-path");
  buttonDelete.forEach(button => {
    button.addEventListener("click", () =>{
      const isConfirm = confirm("bạn có chắc muốn xóa không");
      if(isConfirm){
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}/?_method=DELETE`;
        formDeleteProduct.action = action;

        formDeleteProduct.submit();
      }
    })
  })
}
