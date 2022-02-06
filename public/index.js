//javascript for the front end
console.log("Start working !!");

const row = document.getElementsByClassName("row")[0];
getData();
async function getData() {
  const response = await fetch("/files");
  const data = await response.json();

  data.map((item) => {
    const col = document.createElement("div");
    col.classList.add("col-3", "p-3", "card", "text-center");
    const image = document.createElement("img");
    image.src = `/images/${item.filename}`;
    image.alt = "image";
    image.width = "200";
    image.height = "200";
    const button = document.createElement("button");
    button.classList.add("btn", "btn-danger", "my-3", "delete-btn");
    button.textContent = "Delete";
    col.append(image);
    col.append(button);
    row.append(col);

    //the delete function
    button.addEventListener("click", async () => {
      const response = await fetch(`/files/${item.filename}`, {
        method: "DELETE",
      });
    });
  });
}
