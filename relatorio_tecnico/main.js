import { Octokit } from "https://esm.sh/octokit";

const octokit = new Octokit({
  auth: "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",
});

const { data } = await getDataFromGithub();
const { data: relatorioTecnico } = await getDataFromGithub(
  createMap(data).get("Relatório Técnico").path
);
const contents = createMap(relatorioTecnico);

createTree(contents);

for (let [name, { path, type, download_url, sha }] of contents) {
  const div = document.getElementById(sha);
  console.log(name, download_url, contents);
  div.addEventListener("click", (el) => {
    getContentFromFolder(path, el.target.parentElement, download_url);
  });
}

function createTree(content, parent = "") {
  for (let [name, { path, type, download_url, sha }] of content) {
    createContent(name, type, sha, parent, download_url);
  }
}

function createMap(obj) {
  return new Map(
    obj.map(({ name, type, download_url, sha, path }) => {
      return [name, { path, type, download_url, sha }];
    })
  );
}

async function getContentFromFolder(folder, parent = "", url = "") {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{folder}?ref={branch}",
    {
      owner: "jonathamgg",
      repo: "sarik_validation_graphics",
      folder: folder,
      branch: "master",
    }
  );

  if (parent.classList.contains("is-open")) {
    parent.classList.remove("is-open");
    parent.querySelector("svg").setAttribute("data-icon", "folder");
  } else {
    parent.classList.add("is-open");
    parent.querySelector("svg").setAttribute("data-icon", "folder-open");
  }
  createTree(createMap(data), parent, url);
}

async function getContentFromRaw(url, element) {
  const response = await fetch(url);
  const text = await response.text();
  console.log("oi");
  displayContent(text, element);
}

async function getDataFromGithub(folder = "") {
  const result = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{folder}?ref={branch}",
    {
      owner: "jonathamgg",
      repo: "sarik_validation_graphics",
      folder: folder,
      branch: "master",
    }
  );

  if (result) {
    document.querySelector(".loader").style.display = "none";
    console.log("oi");
  }

  return result;
}

function displayContent(content) {
  const $container = document.querySelector("#content");
  const $content = document.createElement("div");
  const $loader = document.querySelector("section .loader");
  const $holder = document.createElement("div");

  if ($container.children.length) {
    if ($container.children[0].innerText !== content) {
      $loader.style.display = "block";
      $holder.append($loader);
      $container.innerHTML = $holder.innerHTML;

      setTimeout(() => {
        $content.innerHTML = marked.parse(content);
        $container.removeChild($container.children[0]);
        $container.appendChild($content);
        $loader.style.display ='none';
        $container.appendChild($loader);
      }, 2000);
    } else {
      $container.removeChild($container.children[0]);
    }
  } else {
    console.log("esse");
    $content.innerHTML = marked.parse(content);
    $container.appendChild($content);
  }
}

function createContent(name, type, id, $parent = "", url = "") {
  const $folders = document.querySelector(`.${type}`);
  const $folder = document.createElement("div");
  const $holdTitle = document.createElement("div");
  const $icon = document.createElement("icon");
  const $name = document.createElement("p");

  $holdTitle.id = id;
  $folder.setAttribute("data-type", type);

  if (type == "dir") {
    $icon.classList.add("fa-solid", "fa-folder");
    $icon.style.color = "gold";
  } else {
    $icon.classList.add("fa-solid", "fa-file");
  }

  $name.innerText = name;

  $holdTitle.append($icon);
  $holdTitle.append($name);
  $folder.appendChild($holdTitle);

  if ($parent) {
    if ($parent.classList.contains("is-open")) {
      $folder.classList.add("child");
      $folder.style.paddingLeft = "2rem";
      $folder.addEventListener("click", (el) => {
        console.log(url);
        getContentFromRaw(url, el.target);
      });
      $parent.append($folder);
    } else {
      for (let $child of $parent.children) {
        if ($child.classList.contains("child")) {
          $parent.removeChild($child);
        }
      }
    }
  } else {
    $folders.append($folder);
  }
}