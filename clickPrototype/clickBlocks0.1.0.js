//#region Setup
document.body.innerHTML = ""
document.body.style.fontFamily = "Helvetica";
document.body.style.fontSize = "12.5px";
document.body.style.margin = 0;
document.body.style.overscrollBehavior = "none";
document.body.style.padding = 0;
document.title = "Click";

const container = document.createElement("div");
container.style.display = "flex";
container.style.flexDirection = "column";
container.style.height = "100svh";
container.style.width = "100vw";
document.body.appendChild(container);

window.COLOR = {
    WHITE: "#FFFFFF", // level 16
    GRAY_LIGHTEST: "#F0F0F0", // level 15
    GRAY_MEDIUM_LIGHTEST: "#E0E0E0", // level 14
    GRAY_LIGHTER: "#C0C0C0", // level 12
    GRAY_MEDIUM: "#808080", // level 8
    GRAY_MEDIUM_DARKER: "#606060", // level 6
    GRAY_DARKER: "#404040", // level 4
    GRAY_MEDIUM_DARKEST: "#202020", // level 2
    GRAY_DARKEST: "#101010", // level 1
    BLACK: "#000000", // level 0

    RED_MEDIUM: "#F10000", // level 8
    RED_DARKER: "#7E0000", // level 4

    ORANGE_MEDIUM: "#D16900", // level 8
    ORANGE_DARKER: "#6C3600", // level 4

    YELLOW_LIGHTER: "#E7E700", // level 12
    YELLOW_MEDIUM: "#9B9B00", // level 8

    YELLOW_GREEN_MEDIUM: "#5BB500", // level 8

    GREEN_MEDIUM: "#00BF00", // level 8
    GREEN_DARKER: "#006200", // level 4

    GREEN_CYAN_MEDIUM: "#008159", // level 8

    CYAN_MEDIUM: "#009595", // level 8

    CYAN_BLUE_MEDIUM: "#005EBB", // level 8

    BLUE_MEDIUM: "#0000D1", // level 8
    BLUE_DARKER: "#00006C", // level 4

    BLUE_PURPLE_MEDIUM: "#6200C3", // level 8

    PURPLE_MEDIUM: "#A300A3", // level 8
    PURPLE_DARKER: "#540054", // level 4

    PURPLE_RED_MEDIUM: "#D5006B", // level 8
    PURPLE_RED_DARKER: "#6E0037", // level 4
};

window.SHAPE = {
    NONE: 0,
    SQUARE: 1,
    INVERSE_SQUARE: 2,
    HEXAGON: 3,
    INVERSE_HEXAGON: 4,
    OCTAGON: 5,
    INVERSE_OCTAGON: 6,
    CIRCLE: 7,
    INVERSE_CIRCLE: 8,
};

const snapDist = 30;
const snapDistSQ = snapDist ** 2;

const svgNS = "http://www.w3.org/2000/svg";

const clickIcon = document.createElementNS(svgNS, "svg");
clickIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const clickIconPath = document.createElementNS(svgNS, "path");

clickIconPath.setAttributeNS(
    null,
    "d",
    "M199,98C212,-22,48,-22,57,98C41,298,215,298,199,98ZM57,98L199,98M128,8L128,98");

clickIconPath.setAttributeNS(null, "fill", window.COLOR.WHITE);
clickIconPath.setAttributeNS(null, "stroke", window.COLOR.BLACK);
clickIconPath.setAttributeNS(null, "stroke-linejoin", "round");
clickIconPath.setAttributeNS(null, "stroke-width", 16);
clickIcon.appendChild(clickIconPath);

const link = document.createElement("link");
link.href = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(clickIcon))}`;
link.rel = "icon";
link.type = "image/svg";
document.head.appendChild(link);
//#endregion Setup

//#region Title
window.DocumentName = "untitled";

function _click_titleGetDocumentName() {
    return window.DocumentName;
}

function _click_titleSetDocumentName(documentName /*the new document name*/) {
    window.DocumentName = documentName;
}

window.UnsavedChanges = false;

function _click_titleIsSaved() {
    return !window.UnsavedChanges;
}

function _click_titleIsUnsaved() {
    return window.UnsavedChanges;
}

function _click_titleSaved() {
    window.UnsavedChanges = false;
    document.title = `${window.DocumentName} - Click`;
}

function _click_titleUnsaved() {
    window.UnsavedChanges = true;
    document.title = `${window.DocumentName}* - Click`;
}
//#endregion Title

//#region Popups
function _click_popupCloseAll() {
    const popups = document.getElementsByClassName("popup");

    while (popups[0]) {
        popups[0].parentNode.removeChild(popups[0]);
    }
}

function click_popupShow(
    icon, /*icon of the popup*/
    title, /*title of the popup*/
    content, /*element inside the popup*/
    fillScreen, /*whether to fill the available space or not*/) {
    _click_popupCloseAll();

    const popup = document.createElement("div");
    popup.classList.add("popup");

    popup.onpointerdown = function (e) {
        e.stopPropagation();
        document.body.removeChild(popup);
    };

    popup.style.backgroundColor = "rgba(0,0,0,0.5)";
    popup.style.bottom = 0;
    popup.style.cursor = "default";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.left = 0;
    popup.style.padding = "10px";
    popup.style.position = "fixed";
    popup.style.right = 0;
    popup.style.top = 0;
    popup.style.zIndex = 1000;

    // Copy the color of menu items to enable/disable dark mode
    let bc = window.COLOR.GRAY_LIGHTEST;
    let c = window.COLOR.GRAY_DARKER;

    for (const menuItem of document.getElementsByClassName("menuItem")) {
        bc = menuItem.unselectedBackgroundColor/*.style.backgroundColor*/;
        c = menuItem.style.color;
        break;
    }

    const popupWindow = document.createElement("div");

    popupWindow.onpointerdown = function (e) {
        e.stopPropagation();
    };

    popupWindow.style.backgroundColor = bc;
    popupWindow.style.border = `2px solid ${window.COLOR.BLACK}`;
    popupWindow.style.borderRadius = "10px";
    popupWindow.style.boxShadow = "5px 5px 10px 0px rgba(0,0,0,0.5)";
    popupWindow.style.color = c;
    popupWindow.style.display = "flex";
    popupWindow.style.padding = "30px 10px 10px 10px";

    let left = 22;

    if (icon !== undefined) {
        // Copy the node so the popup doesn't steal the icon from, e.g. a menu
        icon = icon.cloneNode(true);
        icon.style.height = "20px";
        icon.style.left = `${left}px`;
        icon.style.position = "absolute";
        icon.style.top = "17px";
        icon.style.width = "20px";
        popupWindow.appendChild(icon);

        left += 20;
    }

    const popupTitle = document.createElement("div");
    popupTitle.innerText = title;
    popupTitle.style.fontWeight = 900;
    popupTitle.style.lineHeight = "30px";
    popupTitle.style.left = `${left}px`;
    popupTitle.style.position = "absolute";
    popupTitle.style.textAlign = "center";
    popupTitle.style.top = "12px";
    popupWindow.appendChild(popupTitle);

    const popupX = document.createElement("div");
    popupX.innerText = "✖";

    popupX.onpointerdown = function (e) {
        e.stopPropagation();
        document.body.removeChild(popup);
    };

    popupX.onpointerenter = function (e) {
        e.target.style.color = window.COLOR.RED_MEDIUM;
    };

    popupX.onpointerleave = function (e) {
        e.target.style.color = window.COLOR.GRAY_DARKER;
    };

    popupX.style.color = window.COLOR.GRAY_DARKER;
    popupX.style.fontWeight = 900;
    popupX.style.lineHeight = "30px";
    popupX.style.position = "absolute";
    popupX.style.right = "22px";
    popupX.style.textAlign = "center";
    popupX.style.top = "12px";
    popupWindow.appendChild(popupX);

    content.style.border = `2px inset ${window.COLOR.BLACK}`;

    if (fillScreen) {
        // Note: For some reason, height=100% doesn't work.
        content.style.height = "calc(100svh - 70px)";
    }

    content.style.width = "100%";
    popupWindow.appendChild(content);

    popup.appendChild(popupWindow);
    document.body.appendChild(popup);
}
//#endregion Popups

//#region Menus
const mainMenu = document.createElement("div");
mainMenu.style.backgroundColor = window.COLOR.GRAY_DARKER;
mainMenu.style.display = "flex";
mainMenu.style.flexDirection = "row";
mainMenu.style.flexWrap = "wrap";
mainMenu.style.userSelect = "none";
container.appendChild(mainMenu);

const click = document.createElement("div");
click.innerText = "Click";
click.style.alignItems = "center";
click.style.color = window.COLOR.RED_MEDIUM;
click.style.display = "flex";
click.style.fontSize = "20px";
click.style.fontStyle = "italic";
click.style.fontWeight = 900;
click.style.height = "40px";
click.style.letterSpacing = "3px";
click.style.overflowWrap = "normal";
click.style.padding = "0px 10px 0px 10px";
click.style.textShadow = `2px 2px 1px ${window.COLOR.RED_DARKER}`;
mainMenu.appendChild(click);

// Menus have name, menuDiv, and menuItemsDiv
window.Menus = [];

function _click_menuCloseAll() {
    for (const menu of window.Menus) {
        if (menu.menuItemsDiv !== undefined) {
            menu.menuItemsDiv.style.display = "none";
        }
    }
}

function _click_menuMouseDown(e /*the mousedown event*/) {
    for (const menu of window.Menus) {
        if (menu.menuItemsDiv !== undefined) {
            if (menu.menuDiv.contains(e.target)) {
                if (menu.menuItemsDiv.style.display !== "block") {
                    menu.menuItemsDiv.style.display = "block";
                } else {
                    menu.menuItemsDiv.style.display = "none";
                }
            } else {
                menu.menuItemsDiv.style.display = "none";
            }
        }
    }
}

function _click_menuKeyDown(e /*the keydown event*/) {
    for (const menu of window.Menus) {
        // Check the menu shortcut keys
        if (e.key === menu.menuDiv.key &&
            (e.ctrlKey || menu.menuDiv.noCtrl) &&
            (e.altKey || menu.menuDiv.noAlt) &&
            (e.shiftKey || menu.menuDiv.noShift)) {
            if (menu.menuItemsDiv !== undefined) {
                _click_menuMouseDown({ target: menu.menuDiv });
            } else {
                menu.menuDiv.onpointerdown(e);
            }

            return;
        }

        // Check the menu item shortcut keys
        if (menu.menuItemsDiv !== undefined) {
            for (const menuItem of menu.menuItemsDiv.children) {
                if (e.key === menuItem.key &&
                    (e.ctrlKey || menuItem.noCtrl) &&
                    (e.altKey || menuItem.noAlt) &&
                    (e.shiftKey || menuItem.noShift)) {
                    menuItem.onpointerdown(e);
                    return;
                }
            }
        }
    }
}

function click_menuAdd(
    icon, /*the icon of the menu*/
    name, /*the name of the menu*/
    shortcutKey, /*the key that triggers the menu*/) {
    const menu = document.createElement("div");

    if (icon !== undefined) {
        icon.style.height = "20px";
        icon.style.width = "20px";
        menu.appendChild(icon);
    }

    const text = document.createElement("div");
    text.innerText = `${name}▾`;
    menu.appendChild(text);

    menu.onpointerenter = function (e) {
        e.target.style.backgroundColor = window.COLOR.GRAY_MEDIUM_DARKER;
    };

    menu.onpointerleave = function (e) {
        e.target.style.backgroundColor = window.COLOR.GRAY_DARKER;
    };

    menu.style.alignItems = "center";
    menu.style.backgroundColor = window.COLOR.GRAY_DARKER;
    menu.style.color = window.COLOR.GRAY_LIGHTEST;
    menu.style.cursor = "pointer";
    menu.style.display = "flex";
    menu.style.fontSize = "15px";
    menu.style.height = "40px";
    menu.style.padding = "0px 10px 0px 10px";
    menu.style.position = "relative";
    mainMenu.appendChild(menu);

    const menuItems = document.createElement("div");
    menuItems.style.backgroundColor = window.COLOR.GRAY_MEDIUM_LIGHTEST;
    menuItems.style.boxShadow = "5px 5px 10px 0px rgba(0,0,0,0.5)";
    menuItems.style.display = "none";
    menuItems.style.left = 0;
    menuItems.style.minWidth = "150px";
    menuItems.style.position = "absolute";
    menuItems.style.top = menu.style.height;
    menuItems.style.zIndex = 500;
    menu.appendChild(menuItems);

    // Set up a keyboard shortcut
    if (shortcutKey !== undefined) {
        const tokens = shortcutKey.split("+");

        menu.key = tokens[tokens.length - 1];

        if (menu.key.length == 1) {
            menu.key = menu.key.toLowerCase();
        } else if (menu.key === "Del") {
            menu.key = "Delete";
        }

        menu.noAlt = !tokens.includes("Alt");
        menu.noCtrl = !tokens.includes("Ctrl");
        menu.noShift = !tokens.includes("Shift");
    }

    const index = window.Menus.push({
        name: name,
        menuDiv: menu,
        menuItemsDiv: menuItems,
    }) - 1;

    return window.Menus[index];
}

function click_menuAddButton(
    icon, /*the icon of the menu*/
    name, /*the name of the menu*/
    shortcutKey, /*the key that triggers the menu*/
    callback, /*the callback when the menu is clicked*/) {
    const menu = document.createElement("div");

    if (icon !== undefined) {
        icon.style.height = "20px";
        icon.style.width = "20px";
        menu.appendChild(icon);
    }

    const text = document.createElement("div");
    text.innerText = name;
    menu.appendChild(text);

    menu.onpointerdown = callback;

    menu.onpointerenter = function (e) {
        e.target.style.backgroundColor = window.COLOR.GRAY_MEDIUM_DARKER;
    };

    menu.onpointerleave = function (e) {
        e.target.style.backgroundColor = window.COLOR.GRAY_DARKER;
    };

    menu.style.alignItems = "center";
    menu.style.backgroundColor = window.COLOR.GRAY_DARKER;
    menu.style.color = window.COLOR.GRAY_LIGHTEST;
    menu.style.cursor = "pointer";
    menu.style.display = "flex";
    menu.style.fontSize = "15px";
    menu.style.height = "40px";
    menu.style.marginLeft = "auto";
    menu.style.padding = "0px 15px 0px 15px";
    menu.style.position = "relative";
    mainMenu.appendChild(menu);

    // Set up a keyboard shortcut
    if (shortcutKey !== undefined) {
        const shortcut = document.createElement("div");
        shortcut.innerText = `(${shortcutKey})`;
        shortcut.style.fontSize = "12.5px";
        shortcut.style.marginLeft = "5px";
        menu.appendChild(shortcut);

        const tokens = shortcutKey.split("+");

        menu.key = tokens[tokens.length - 1];

        if (menu.key.length == 1) {
            menu.key = menu.key.toLowerCase();
        } else if (menu.key === "Del") {
            menu.key = "Delete";
        }

        menu.noAlt = !tokens.includes("Alt");
        menu.noCtrl = !tokens.includes("Ctrl");
        menu.noShift = !tokens.includes("Shift");
    }

    const index = window.Menus.push({ name: name, menuDiv: menu }) - 1;

    return window.Menus[index];
}

function click_menuAddItem(
    menu, /*the menu to add to*/
    icon, /*the icon of the menu item*/
    name, /*the name of the menu item*/
    shortcutKey, /*the key that triggers the menu item*/
    callback, /*the callback when the menu item is clicked*/) {
    const a = document.createElement("a");
    a.classList.add("menuItem");

    if (icon !== undefined) {
        icon.style.height = "20px";
        icon.style.width = "20px";
        a.appendChild(icon);
    }

    const text = document.createElement("div");
    text.innerText = name;
    a.appendChild(text);

    a.onpointerdown = callback;

    a.onpointerenter = function (e) {
        e.target.style.backgroundColor = e.target.selectedBackgroundColor;
    };

    a.onpointerleave = function (e) {
        e.target.style.backgroundColor = e.target.unselectedBackgroundColor;
    };

    a.selectedBackgroundColor = window.COLOR.GRAY_LIGHTER;
    a.style.alignItems = "center";
    a.style.backgroundColor = window.COLOR.GRAY_LIGHTEST;
    a.style.color = window.COLOR.GRAY_DARKER;
    a.style.display = "flex";
    a.style.flexDirection = "row";
    a.style.flexWrap = "wrap";
    a.style.fontSize = "15px";
    a.style.textDecoration = "none";
    a.style.padding = "10px 15px 10px 15px";
    a.unselectedBackgroundColor = window.COLOR.GRAY_LIGHTEST;
    menu.menuItemsDiv.appendChild(a);

    // Set up a keyboard shortcut
    if (shortcutKey !== undefined) {
        const shortcut = document.createElement("div");
        shortcut.innerText = `(${shortcutKey})`;
        shortcut.style.fontSize = "12.5px";
        shortcut.style.marginLeft = "auto";
        a.appendChild(shortcut);

        const tokens = shortcutKey.split("+");

        a.key = tokens[tokens.length - 1];

        if (a.key.length == 1) {
            a.key = a.key.toLowerCase();
        } else if (a.key === "Del") {
            a.key = "Delete";
        }

        a.noAlt = !tokens.includes("Alt");
        a.noCtrl = !tokens.includes("Ctrl");
        a.noShift = !tokens.includes("Shift");
    }

    return a;
}

function click_menuAddSeparator(menu, /*the menu to add to*/) {
    const hr = document.createElement("hr");
    hr.style.backgroundColor = "transparent";
    hr.style.border = 0;
    hr.style.cursor = "default";
    hr.style.margin = "0px";
    hr.style.padding = "1px 0px 1px 0px";
    menu.menuItemsDiv.appendChild(hr);
}
//#endregion Menus

//#region Blocks
const GRID_SIZE = 10;
const MIN_SHAPE_WIDTH = GRID_SIZE * 6;
const MIN_SHAPE_HEIGHT = GRID_SIZE * 0.5;

const svg = document.createElementNS(svgNS, "svg");
svg.style.height = "100%";
container.appendChild(svg);

const defs = document.createElementNS(svgNS, "defs");
svg.appendChild(defs);

const smallGrid = document.createElementNS(svgNS, "pattern");
smallGrid.setAttributeNS(null, "height", GRID_SIZE);
smallGrid.setAttributeNS(null, "id", "smallGrid");
smallGrid.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
smallGrid.setAttributeNS(null, "width", GRID_SIZE);
defs.appendChild(smallGrid);

const smallGridPath = document.createElementNS(svgNS, "path");
smallGridPath.classList.add("background");
smallGridPath.setAttributeNS(null, "d", `M0,0H${GRID_SIZE}V${GRID_SIZE}H0V0`);
smallGridPath.setAttributeNS(null, "fill", window.COLOR.WHITE);
smallGridPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_LIGHTEST);
smallGridPath.setAttributeNS(null, "stroke-width", 1);
smallGrid.appendChild(smallGridPath);

const grid = document.createElementNS(svgNS, "rect");
grid.setAttributeNS(null, "width", "100%");
grid.setAttributeNS(null, "height", "100%");
grid.setAttributeNS(null, "fill", "url(#smallGrid)");
svg.appendChild(grid);

// Blocks are HTML elements
window.Blocks = [];

function _click_blockGetPosition(block) {
    const transform = block.transform.baseVal.getItem(0);
    if (block.parentElement === svg) {
        return [transform.matrix.e, transform.matrix.f];
    }
    const [x, y] = _click_blockGetPosition(block.parentElement);
    return [x + transform.matrix.e, y + transform.matrix.f];
}

function _click_roundToGrid(x) {
    return Math.round(x / GRID_SIZE) * GRID_SIZE;
}

function _click_dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function _click_distSQ(x1, y1, x2, y2) {
    return (x2 - x1) ** 2 + (y2 - y1) ** 2;
}

function _click_snapToBlocks(snappingBlock) {
    const output = snappingBlock.output;
    if (output === undefined) {
        return;
    }
    const [snappingBlockX, snappingBlockY] = _click_blockGetPosition(snappingBlock);
    const outputX = snappingBlockX + output.x;
    const outputY = snappingBlockY + output.y;

    let minDistSQ = Infinity;
    let minBlock;
    let minInputX;
    let minInputY;

    for (const block of window.Blocks) {
        if (block === snappingBlock) {
            continue;
        }
        const [blockX, blockY] = _click_blockGetPosition(block);
        for (const input of block.inputs) {
            if (output.type !== input.type) {
                continue;
            }
            const inputX = blockX + input.x;
            const inputY = blockY + input.y;

            const distSQ = _click_distSQ(outputX, outputY, inputX, inputY);
            if (distSQ > snapDistSQ) {
                continue;
            }
            if (distSQ >= minDistSQ) {
                continue;
            }
            minDistSQ = distSQ;
            minBlock = block;
            minInputX = input.x;
            minInputY = input.y;
        }
    }
    if (minDistSQ !== Infinity) {
        console.log("Snap!");
        minBlock.appendChild(snappingBlock);
        const newX = minInputX - output.x;
        const newY = minInputY - output.y;
        return [newX, newY];
    }
}

function _click_blockDuplicate(block) {
    const duplicated = block.cloneNode(true);
    svg.appendChild(duplicated);
    window.Blocks.push(duplicated);
    return duplicated;
}

function _click_blockDrawLeftToRight(shape, width) {
    switch (shape) {
        case window.SHAPE.NONE:
        default:
            return `h${width}`;
        case window.SHAPE.SQUARE:
            // Make the hat larger than an indent
            return `v${MIN_SHAPE_HEIGHT * -2}h${MIN_SHAPE_WIDTH}v${MIN_SHAPE_HEIGHT * 2}h${width - MIN_SHAPE_WIDTH}`;
        case window.SHAPE.INVERSE_SQUARE:
            return `h${GRID_SIZE}v${MIN_SHAPE_HEIGHT}h${MIN_SHAPE_WIDTH - GRID_SIZE * 2}v${-MIN_SHAPE_HEIGHT}h${width - MIN_SHAPE_WIDTH + GRID_SIZE}`;
        case window.SHAPE.HEXAGON:
            // Make the hat larger than an indent
            return `l${MIN_SHAPE_WIDTH * 0.5},${MIN_SHAPE_HEIGHT * -2}l${MIN_SHAPE_WIDTH * 0.5},${MIN_SHAPE_HEIGHT * 2}h${width - MIN_SHAPE_WIDTH}`;
        case window.SHAPE.INVERSE_HEXAGON:
            return `h${GRID_SIZE}l${MIN_SHAPE_WIDTH * 0.5 - GRID_SIZE},${MIN_SHAPE_HEIGHT}l${MIN_SHAPE_WIDTH * 0.5 - GRID_SIZE},${-MIN_SHAPE_HEIGHT}h${width - MIN_SHAPE_WIDTH + GRID_SIZE}`;
        case window.SHAPE.OCTAGON:
            // Make the hat larger than an indent
            return `l${GRID_SIZE * 1.5},${MIN_SHAPE_HEIGHT * -2}h${MIN_SHAPE_WIDTH - GRID_SIZE * 3}l${GRID_SIZE * 1.5},${MIN_SHAPE_HEIGHT * 2}h${width - MIN_SHAPE_WIDTH}`;
        case window.SHAPE.INVERSE_OCTAGON:
            return `h${GRID_SIZE}l${GRID_SIZE},${MIN_SHAPE_HEIGHT}h${MIN_SHAPE_WIDTH - GRID_SIZE * 4}l${GRID_SIZE},${-MIN_SHAPE_HEIGHT}h${width - MIN_SHAPE_WIDTH + GRID_SIZE}`;
        case window.SHAPE.CIRCLE:
            // Make the hat larger than an indent
            return `a${MIN_SHAPE_WIDTH * 0.85},${MIN_SHAPE_WIDTH * 0.85},0,0,1,${MIN_SHAPE_WIDTH},0h${width - MIN_SHAPE_WIDTH}`;
        case window.SHAPE.INVERSE_CIRCLE:
            return `h${GRID_SIZE}a${MIN_SHAPE_WIDTH * 0.66},${MIN_SHAPE_WIDTH * 0.66},0,0,0,${MIN_SHAPE_WIDTH - GRID_SIZE * 2},0h${width - MIN_SHAPE_WIDTH + GRID_SIZE}`;
    }
}

function _click_blockDrawTopToBottom(shape, height) {
    switch (shape) {
        case window.SHAPE.NONE:
        default:
            return `v${height}`;
        case window.SHAPE.SQUARE:
            return `h${height * 0.5}v${height}h${height * -0.5}`;
        case window.SHAPE.INVERSE_SQUARE:
            return `h${height * 0.5 - MIN_SHAPE_HEIGHT}v${MIN_SHAPE_HEIGHT * 0.5}h${height * -0.5}v${height - MIN_SHAPE_HEIGHT}h${height * 0.5}v${MIN_SHAPE_HEIGHT * 0.5}h${height * -0.5 + MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.HEXAGON:
            return `l${height * 0.5},${height * 0.5}l${height * -0.5},${height * 0.5}`;
        case window.SHAPE.INVERSE_HEXAGON:
            return `h${height * 0.5 - MIN_SHAPE_HEIGHT}l${height * -0.5},${height * 0.5}l${height * 0.5},${height * 0.5}h${height * -0.5 + MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.OCTAGON:
            return `l${height * 0.5},${height * 0.25}v${height * 0.5}l${height * -0.5},${height * 0.25}`;
        case window.SHAPE.INVERSE_OCTAGON:
            return `h${height * 0.5 - MIN_SHAPE_HEIGHT}l${height * -0.5},${height * 0.25}v${height * 0.5}l${height * 0.5},${height * 0.25}h${height * -0.5 + MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.CIRCLE:
            return `a${height * 0.5},${height * 0.5},0,0,1,0,${height}`;
        case window.SHAPE.INVERSE_CIRCLE:
            return `h${height * 0.5 - MIN_SHAPE_HEIGHT}a${height * 0.5},${height * 0.5},0,0,0,0,${height}h${height * -0.5 + MIN_SHAPE_HEIGHT}`;
    }
}

function _click_blockDrawRightToLeft(shape, width) {
    switch (shape) {
        case window.SHAPE.NONE:
        default:
            return `h${-width}`;
        case window.SHAPE.SQUARE:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}v${MIN_SHAPE_HEIGHT}h${-MIN_SHAPE_WIDTH + GRID_SIZE * 2}v${-MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.INVERSE_SQUARE:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}v${-MIN_SHAPE_HEIGHT}h${-MIN_SHAPE_WIDTH + GRID_SIZE * 2}v${MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.HEXAGON:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE},${MIN_SHAPE_HEIGHT}l${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE},${-MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.INVERSE_HEXAGON:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE},${-MIN_SHAPE_HEIGHT}l${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE},${MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.OCTAGON:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.25 + GRID_SIZE * 0.5},${MIN_SHAPE_HEIGHT}h${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.25 + GRID_SIZE * 0.5},${-MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.INVERSE_OCTAGON:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.25 + GRID_SIZE * 0.5},${-MIN_SHAPE_HEIGHT}h${MIN_SHAPE_WIDTH * -0.5 + GRID_SIZE}l${MIN_SHAPE_WIDTH * -0.25 + GRID_SIZE * 0.5},${MIN_SHAPE_HEIGHT}h${-GRID_SIZE}`;
        case window.SHAPE.CIRCLE:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}a${MIN_SHAPE_WIDTH * 0.66},${MIN_SHAPE_WIDTH * 0.66},0,0,1,${-MIN_SHAPE_WIDTH + GRID_SIZE * 2},0h${-GRID_SIZE}`;
        case window.SHAPE.INVERSE_CIRCLE:
            return `h${-width + MIN_SHAPE_WIDTH - GRID_SIZE}a${MIN_SHAPE_WIDTH * 0.66},${MIN_SHAPE_WIDTH * 0.66},0,0,0,${-MIN_SHAPE_WIDTH + GRID_SIZE * 2},0h${-GRID_SIZE}`;
    }
}

function _click_blockDrawBottomToTop(shape, height) {
    switch (shape) {
        case window.SHAPE.NONE:
        default:
            return `v${-height}`;
        case window.SHAPE.SQUARE:
            return `h${height * -0.5}v${-height}h${height * 0.5}`;
        case window.SHAPE.INVERSE_SQUARE:
            return `h${height * -0.5 + MIN_SHAPE_HEIGHT}v${-MIN_SHAPE_HEIGHT * 0.5}h${height * 0.5}v${-height + MIN_SHAPE_HEIGHT}h${-height * 0.5}v${-MIN_SHAPE_HEIGHT * 0.5}h${height * 0.5 - MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.HEXAGON:
            return `l${height * -0.5},${height * -0.5}l${height * 0.5},${height * -0.5}`;
        case window.SHAPE.INVERSE_HEXAGON:
            return `h${height * -0.5 + MIN_SHAPE_HEIGHT}l${height * 0.5},${height * -0.5}l${height * -0.5},${height * -0.5}h${height * 0.5 - MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.OCTAGON:
            return `l${height * -0.5},${height * -0.25}v${height * -0.5}l${height * 0.5},${height * -0.25}`;
        case window.SHAPE.INVERSE_OCTAGON:
            return `h${height * -0.5 + MIN_SHAPE_HEIGHT}l${height * 0.5},${height * -0.25}v${height * -0.5}l${height * -0.5},${height * -0.25}h${height * 0.5 - MIN_SHAPE_HEIGHT}`;
        case window.SHAPE.CIRCLE:
            return `a${height * 0.5},${height * 0.5},0,0,1,0,${-height}`;
        case window.SHAPE.INVERSE_CIRCLE:
            return `h${height * -0.5 + MIN_SHAPE_HEIGHT}a${height * 0.5},${height * 0.5},0,0,0,0,${-height}h${height * 0.5 - MIN_SHAPE_HEIGHT}`;
    }
}

function click_addBlock(
    x,
    y,
    fill,
    stroke,
    topShape,
    rightShape,
    bottomShape,
    leftShape,
    content,
    nestedTopShape,
    nestedBottomShape,
    nestedHeight) {
    const g = document.createElementNS(svgNS, "g");
    //g.onpointerdown = _click_dragStart;   Not needed because it is called from _click_blockMouseDown
    //g.onpointerup = _click_dragEnd;
    g.setAttributeNS(null, "transform", `translate(${x},${y})`);
    g.style.cursor = "grab";
    svg.appendChild(g);

    const shape = document.createElementNS(svgNS, "path");
    shape.setAttributeNS(null, "fill", fill);
    shape.setAttributeNS(null, "stroke", stroke);
    shape.setAttributeNS(null, "stroke-linejoin", "round");
    shape.setAttributeNS(null, "stroke-width", 1);
    g.appendChild(shape);

    let rawShapeWidth = 0;
    let rawShapeHeight = 0;
    let texts = [];

    for (const line of content.split("\n")) {
        const text = document.createElementNS(svgNS, "text");
        text.setAttributeNS(null, "dominant-baseline", "hanging");
        text.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
        text.setAttributeNS(null, "font-size", "12.5px");
        text.textContent = line;
        g.appendChild(text);

        const bbox = text.getBBox();
        rawShapeWidth = Math.max(rawShapeWidth, bbox.width);
        rawShapeHeight = rawShapeHeight + bbox.height;
        texts.push(text);
    }

    // Fit the shape to the text and center the text
    const hasTopOrBottom = topShape !== window.SHAPE.NONE ||
        bottomShape !== window.SHAPE.NONE;

    const hasNested = nestedTopShape !== undefined ||
        nestedBottomShape !== undefined ||
        nestedHeight !== undefined;

    const hasNestedTopOrBottom = hasNested &&
        (nestedTopShape !== window.SHAPE.NONE ||
            nestedBottomShape !== window.SHAPE.NONE);

    let shapeWidth = _click_roundToGrid(rawShapeWidth + GRID_SIZE * 2);

    // The min shape width is relevant if there is a top or bottom shape
    if (hasNestedTopOrBottom) {
        // The width also needs to include an indent for the nested blocks
        shapeWidth = Math.max(shapeWidth, MIN_SHAPE_WIDTH + GRID_SIZE);
    } else if (hasTopOrBottom) {
        shapeWidth = Math.max(shapeWidth, MIN_SHAPE_WIDTH);
    }

    let shapeHeight = _click_roundToGrid(rawShapeHeight + GRID_SIZE * 2);



    g.output;
    g.inputs = [];

    if (hasTopOrBottom) {
        if (
            topShape === window.SHAPE.INVERSE_SQUARE ||
            topShape === window.SHAPE.INVERSE_HEXAGON ||
            topShape === window.SHAPE.INVERSE_OCTAGON ||
            topShape === window.SHAPE.INVERSE_CIRCLE) {
            g.output = {
                x: 30,
                y: 0,
                type: "code"
            };
        }
        if (hasNested) {
            g.inputs.push(
                {
                    x: 40,
                    y: shapeHeight,
                    type: "code"
                }
            );
            g.inputs.push(
                {
                    x: 30,
                    y: 80,
                    type: "code"
                }
            );
        } else {
            g.inputs.push(
                {
                    x: 30,
                    y: shapeHeight,
                    type: "code"
                }
            );
        }
    } else {
        g.output = {
            x: 0,
            y: shapeHeight * 0.5,
            type: "string"
        };
    }
    if (
        rightShape === window.SHAPE.INVERSE_SQUARE ||
        rightShape === window.SHAPE.INVERSE_HEXAGON ||
        rightShape === window.SHAPE.INVERSE_OCTAGON ||
        rightShape === window.SHAPE.INVERSE_CIRCLE) {
        g.inputs.push(
            {
                x: shapeWidth + shapeHeight * 0.25,
                y: shapeHeight * 0.5,
                type: "string"
            }
        );
    }



    let path = "M0,0";

    // Draw the top-side shape
    // Starts at (0, 0) and must end at (shapeWidth, 0)
    path += _click_blockDrawLeftToRight(topShape, shapeWidth);

    // Draw the right-side shape
    // Starts at (shapeWidth, 0) and must end at (shapeWidth, shapeHeight)
    path += _click_blockDrawTopToBottom(rightShape, shapeHeight);

    // Draw the bottom-side shape
    // Starts at (shapeWidth, shapeHeight) and must end at (0, shapeHeight)
    if (hasNested) {
        // Draw a spot for nested blocks
        nestedHeight = nestedHeight >= 0 ? nestedHeight : 0;

        // Starts at (shapeWidth, shapeHeight) and must end at
        // (GRID_SIZE, shapeHeight)
        path += _click_blockDrawRightToLeft(
            nestedTopShape,
            shapeWidth - GRID_SIZE);

        path += `V${shapeHeight + nestedHeight}`;

        // Starts at (GRID_SIZE, shapeHeight + nestedHeight) and must end at
        // (shapeWidth, shapeHeight + nestedHeight)
        path += _click_blockDrawLeftToRight(
            nestedBottomShape,
            shapeWidth - GRID_SIZE);

        path += `V${shapeHeight + nestedHeight + GRID_SIZE * 2}`;

        // Starts at (shapeWidth, shapeHeight + nestedHeight + GRID_SIZE * 2)
        // and must end at (0, shapeHeight + nestedHeight + GRID_SIZE * 2)
        path += _click_blockDrawRightToLeft(bottomShape, shapeWidth);

        path += `V${shapeHeight}`
    } else {
        // Don't draw a spot for nested blocks
        path += _click_blockDrawRightToLeft(bottomShape, shapeWidth);
    }

    // Draw the left-side shape
    // Starts at (0, shapeHeight) and must end at (0, 0)
    path += _click_blockDrawBottomToTop(leftShape, shapeHeight);

    path += "Z";

    shape.setAttributeNS(null, "d", path);

    // TODO: Why do we need this fudge factor of +2?
    let textY = (shapeHeight - rawShapeHeight) * 0.5 + 2;

    for (const text of texts) {
        text.setAttributeNS(null, "x", (shapeWidth - rawShapeWidth) * 0.5);
        text.setAttributeNS(null, "y", textY);
        textY += text.getBBox().height;
    }

    const outline = document.createElementNS(svgNS, "path");
    outline.classList.add("outline");
    outline.setAttributeNS(null, "d", path);
    outline.setAttributeNS(null, "fill", "transparent");
    outline.setAttributeNS(null, "stroke", window.COLOR.YELLOW_LIGHTER);
    outline.setAttributeNS(null, "stroke-linejoin", "round");
    outline.setAttributeNS(null, "stroke-width", 0);
    g.appendChild(outline);

    // Debug snap connection dots
    if (g.output !== undefined) {
        const outputDot = document.createElementNS(svgNS, "circle");
        outputDot.setAttributeNS(null, "cx", g.output.x);
        outputDot.setAttributeNS(null, "cy", g.output.y);
        outputDot.setAttributeNS(null, "r", "3");
        outputDot.setAttributeNS(null, "fill", "blue");
        g.appendChild(outputDot);
    }

    let inputDot;
    for (input of g.inputs) {
        inputDot = document.createElementNS(svgNS, "circle");
        inputDot.setAttributeNS(null, "cx", input.x);
        inputDot.setAttributeNS(null, "cy", input.y);
        inputDot.setAttributeNS(null, "r", "3");
        inputDot.setAttributeNS(null, "fill", "orange");
        g.appendChild(inputDot);
    }



    const index = window.Blocks.push(g) - 1;

    return window.Blocks[index];
}
//#endregion Blocks

//#region Drags
// Drags maps each pointerId to targetBlock, originalX/Y, and offsetX/Y
window.Drags = new Map();

function _click_print_x_y(element) {
    //let element = document.getElementById('yourElementId'); // replace with your element id
    let style = window.getComputedStyle(element);
    let matrix = new WebKitCSSMatrix(style.transform);

    let translateX = matrix.m41;
    let translateY = matrix.m42;
    let translateZ = matrix.m43;

    console.log(`Translation is (${translateX}, ${translateY}, ${translateZ})`);
}

function _click_dragIsDragging(block) {
    for ([_pointerId, drag] of window.Drags) {
        if (block === drag.targetBlock) {
            return true;
        }
    }
    return false;
}

function _click_dragPointerDown(e) {
    let targetBlock = e.target.parentNode;

    if (!window.Blocks.includes(targetBlock)) {
        return;
    }

    if (e.altKey || _click_dragIsDragging(targetBlock)) {
        targetBlock = _click_blockDuplicate(targetBlock);
    }

    targetBlock.style.cursor = "grabbing";

    const [targetBlockX, targetBlockY] = _click_blockGetPosition(targetBlock);

    // Disconnect the target block from other blocks and move it to the bottom of the list to draw on top
    svg.append(targetBlock);

    // Set transform relitive to the page instead of the old attached block.
    const transform = targetBlock.transform.baseVal.getItem(0);
    transform.setTranslate(
        targetBlockX,
        targetBlockY
    );

    window.Drags.set(
        e.pointerId,
        {
            targetBlock: targetBlock,
            originalX: e.pageX,
            originalY: e.pageY,
            offsetX: targetBlockX - e.pageX,
            offsetY: targetBlockY - e.pageY
        }
    );
}

function _click_dragPointerMove(e) {
    if (!window.Drags.has(e.pointerId)) {
        return;
    }

    const drag = window.Drags.get(e.pointerId);
    const transform = drag.targetBlock.transform.baseVal.getItem(0);
    transform.setTranslate(
        e.pageX + drag.offsetX,
        e.pageY + drag.offsetY
    );
}

function _click_dragPointerUp(e) {
    if (!window.Drags.has(e.pointerId)) {
        return;
    }

    const drag = window.Drags.get(e.pointerId);
    const snapToBlocks = _click_snapToBlocks(drag.targetBlock);
    let newX, newY;
    if (snapToBlocks === undefined) {
        newX = _click_roundToGrid(e.pageX + drag.offsetX);
        newY = _click_roundToGrid(e.pageY + drag.offsetY);
    } else {
        [newX, newY] = snapToBlocks;
    }
    
    if (newX !== drag.originalX || newY !== drag.originalY) {
        _click_titleUnsaved();
        const transform = drag.targetBlock.transform.baseVal.getItem(0);
        transform.setTranslate(newX, newY);
    }

    drag.targetBlock.style.cursor = "grab";
    window.Drags.delete(e.pointerId);
}

function _click_dragCancelAll() {
    for (const [_pointerId, drag] of window.Drags) {
        const transform = drag.targetBlock.transform.baseVal.getItem(0);
        transform.setTranslate(drag.originalX + drag.offsetX, drag.originalY + drag.offsetY);
        drag.targetBlock.style.cursor = "grab";
    }

    window.Drags.clear();
}
//#endregion Drags

//#region Clipboards
window.Clipboards = [];
//#endregion Clipboards

//#region Events
window.onclick = function (e) {
    e.preventDefault();
};

window.oncontextmenu = function (e) {
    e.preventDefault();
};

window.onkeydown = function (e) {
    e.preventDefault();

    if (e.key === "Escape") {
        _click_popupCloseAll();
        _click_menuCloseAll();
        _click_dragCancelAll();
    } else {
        _click_menuKeyDown(e);
    }
};

window.onmousedown = function (e) {
    e.preventDefault();
};

window.onmousemove = function (e) {
    e.preventDefault();
};

window.onmouseup = function (e) {
    e.preventDefault();
};

window.onpointerdown = function (e) {
    e.preventDefault();
    _click_menuMouseDown(e);
    _click_dragPointerDown(e);
}

window.onpointermove = function (e) {
    // TODO: Disable pinch/zoom
    e.preventDefault();
    _click_dragPointerMove(e);
}

window.onpointerup = function (e) {
    e.preventDefault();
    _click_dragPointerUp(e);
}

window.onresize = function (e) {
    e.preventDefault();
    _click_menuCloseAll();
    _click_dragCancelAll();
};

window.ontouchcancel = function (e) {
    e.preventDefault();
};

window.ontouchend = function (e) {
    e.preventDefault();
}

window.ontouchmove = function (e) {
    e.preventDefault();
};

/*window.ontouchstart*/ window.addEventListener("touchstart", function (e) {
    e.preventDefault();
}, { passive: false });

window.onbeforeunload = function (e) {
    if (_click_titleIsUnsaved()) {
        e.preventDefault();
        return e.returnValue = true;
    }
};
//#endregion Events

//#region Click Menus
//#region File Menu
const fileIcon = document.createElementNS(svgNS, "svg");
fileIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const fileIconPath = document.createElementNS(svgNS, "path");
fileIconPath.setAttributeNS(null, "d", "M35,8H128L221,93V248H35ZM128,8V93M128,93H221ZM60,68H103M60,128H196M60,188H196");
fileIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
fileIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
fileIconPath.setAttributeNS(null, "stroke-linejoin", "round");
fileIconPath.setAttributeNS(null, "stroke-width", 16);
fileIcon.appendChild(fileIconPath);

const fileMenu = click_menuAdd(fileIcon, "File", "Alt+F");

const fileNewIcon = document.createElementNS(svgNS, "svg");
fileNewIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const fileNewIconPath = document.createElementNS(svgNS, "path");
fileNewIconPath.setAttributeNS(null, "d", "M35,8H128L221,93V248H35ZM128,8V93M128,93H221Z");
fileNewIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
fileNewIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
fileNewIconPath.setAttributeNS(null, "stroke-linejoin", "round");
fileNewIconPath.setAttributeNS(null, "stroke-width", 16);
fileNewIcon.appendChild(fileNewIconPath);

click_menuAddItem(
    fileMenu,
    fileNewIcon,
    "New",
    undefined, // Note: Ctrl+N seems to be reserved to open a new browser window
    function (e) {
        // TODO: Do this the real way
        if (_click_titleIsSaved() ||
            confirm("There are unsaved changes. Continue anyway?")) {
            for (let i = window.Blocks.length - 1; i >= 0; i--) {
                const block = window.Blocks[i];
                svg.removeChild(block);
            }

            window.Blocks.length = 0;
            _click_titleSaved();
        }
    });

const fileOpenIcon = document.createElementNS(svgNS, "svg");
fileOpenIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const fileOpenIconPath = document.createElementNS(svgNS, "path");
fileOpenIconPath.setAttributeNS(null, "d", "M8,47L30,23H83L104,47H223V95H245L223,233H8ZM8,233L32,95M32,95H223Z");
fileOpenIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
fileOpenIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
fileOpenIconPath.setAttributeNS(null, "stroke-linejoin", "round");
fileOpenIconPath.setAttributeNS(null, "stroke-width", 16);
fileOpenIcon.appendChild(fileOpenIconPath);

click_menuAddItem(
    fileMenu,
    fileOpenIcon,
    "Open...",
    "Ctrl+O",
    function (e) {
        // TODO: Do this the real way
        const input = document.createElement("input");
        input.accept = ".click";

        input.onchange = function (e) {
            if (_click_titleIsSaved() ||
                confirm("There are unsaved changes. Continue anyway?")) {
                const file = e.target.files[0];

                const reader = new FileReader();

                reader.onload = function (e) {
                    const contents = e.target.result;

                    for (let i = window.Blocks.length - 1; i >= 0; i--) {
                        const block = window.Blocks[i];
                        svg.removeChild(block);
                    }

                    window.Blocks.length = 0;

                    svg.innerHTML = contents;

                    for (const child of svg.children) {
                        if (child.nodeName === "g") {
                            child.onpointerdown = _click_dragStart;
                            child.onpointerup = _click_dragEnd;
                            window.Blocks.push(child);
                        }
                    }

                    _click_titleSaved();
                };

                reader.readAsText(file);
            }
        };

        input.type = "file";
        input.click();
    });

click_menuAddSeparator(fileMenu);

const fileSaveIcon = document.createElementNS(svgNS, "svg");
fileSaveIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const fileSaveIconPath = document.createElementNS(svgNS, "path");
fileSaveIconPath.setAttributeNS(null, "d", "M112,8H144V120H176L128,184L80,120H112ZM8,216H248V248H8Z");
fileSaveIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
fileSaveIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
fileSaveIconPath.setAttributeNS(null, "stroke-linejoin", "round");
fileSaveIconPath.setAttributeNS(null, "stroke-width", 16);
fileSaveIcon.appendChild(fileSaveIconPath);

click_menuAddItem(
    fileMenu,
    fileSaveIcon,
    "Save",
    "Ctrl+S",
    function (e) {
        // TODO: Do this the real way
        const a = document.createElement("a");
        a.download = `${_click_titleGetDocumentName()}.click`;

        const blob = new Blob([svg.innerHTML], { type: "text/plain" });
        const url = window.URL.createObjectURL(blob);
        a.href = url
        a.click();
        window.URL.revokeObjectURL(url);
        _click_titleSaved();
    });
//#endregion File Menu

//#region Edit Menu
const editIcon = document.createElementNS(svgNS, "svg");
editIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const editIconPath = document.createElementNS(svgNS, "path");
editIconPath.setAttributeNS(null, "d", "M200,8L248,56L104,200L8,248L56,152ZM56,152L104,200");
editIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
editIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
editIconPath.setAttributeNS(null, "stroke-linejoin", "round");
editIconPath.setAttributeNS(null, "stroke-width", 16);
editIcon.appendChild(editIconPath);

const editMenu = click_menuAdd(editIcon, "Edit", "Alt+E");

click_menuAddItem(
    editMenu,
    undefined,
    "Undo",
    "Ctrl+Z",
    function (e) {
        //TODO
        const text = document.createElement("div");
        text.innerText = "TODO: Implement Edit Undo!";
        text.style.padding = "5px 5px 5px 5px";
        click_popupShow(undefined, "Edit->Undo", text, false);
    });

click_menuAddItem(
    editMenu,
    undefined,
    "Redo",
    "Ctrl+Y",
    function (e) {
        //TODO
        const text = document.createElement("div");
        text.innerText = "TODO: Implement Edit Redo!";
        text.style.padding = "5px 5px 5px 5px";
        click_popupShow(undefined, "Edit->Redo", text, false);
    });

click_menuAddSeparator(editMenu);

click_menuAddItem(
    editMenu,
    undefined,
    "Cut",
    "Ctrl+X",
    function (e) {
        window.Clipboards.length = 0;

        for (let i = window.Blocks.length - 1; i >= 0; i--) {
            const block = window.Blocks[i];

            if (_click_blockIsSelected(block)) {
                _click_titleUnsaved();
                window.Blocks.splice(i, 1);
                svg.removeChild(block);
                window.Clipboards.push(block);
            }
        }
    });

click_menuAddItem(
    editMenu,
    undefined,
    "Copy",
    "Ctrl+C",
    function (e) {
        window.Clipboards.length = 0;

        for (let i = window.Blocks.length - 1; i >= 0; i--) {
            const block = window.Blocks[i];

            if (_click_blockIsSelected(block)) {
                window.Clipboards.push(block.cloneNode(true));
            }
        }
    });

click_menuAddItem(
    editMenu,
    undefined,
    "Paste",
    "Ctrl+V",
    function (e) {
        for (let i = window.Clipboards.length - 1; i >= 0; i--) {
            _click_titleUnsaved();
            const block = window.Clipboards[i];
            const newBlock = block.cloneNode(true);

            newBlock.onpointerdown = _click_dragStart;
            newBlock.onpointerup = _click_dragEnd;
            svg.appendChild(newBlock);
            window.Blocks.push(newBlock);
        }
    });

click_menuAddItem(
    editMenu,
    undefined,
    "Delete",
    "Del",
    function (e) {
        _click_blockDeleteSelected();
    });

click_menuAddSeparator(editMenu);

click_menuAddItem(
    editMenu,
    undefined,
    "Select All",
    "Ctrl+A",
    function (e) {
        _click_blockSelectAll();
    });
//#endregion Edit Menu

//#region View Menu
const viewIcon = document.createElementNS(svgNS, "svg");
viewIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const viewIconPath = document.createElementNS(svgNS, "path");
viewIconPath.setAttributeNS(null, "d", "M8,48H248V183H8ZM66,183H190V208H66Z");
viewIconPath.setAttributeNS(null, "fill", window.COLOR.GRAY_LIGHTEST);
viewIconPath.setAttributeNS(null, "stroke", window.COLOR.GRAY_DARKER);
viewIconPath.setAttributeNS(null, "stroke-linejoin", "round");
viewIconPath.setAttributeNS(null, "stroke-width", 16);
viewIcon.appendChild(viewIconPath);

const viewMenu = click_menuAdd(viewIcon, "View", "Alt+V");

const darkModeMenuItem = click_menuAddItem(
    viewMenu,
    undefined,
    "Dark Mode",
    undefined,
    function (e) {
        // Find the affected elements
        const backgrounds = document.getElementsByClassName("background");
        const menuItems = document.getElementsByClassName("menuItem");

        if (darkModeMenuItem.innerText === "Dark Mode") {
            for (const background of backgrounds) {
                background.setAttributeNS(null, "fill", window.COLOR.BLACK);

                background.setAttributeNS(
                    null,
                    "stroke",
                    window.COLOR.GRAY_MEDIUM_DARKEST);
            }

            for (const menuItem of menuItems) {
                menuItem.selectedBackgroundColor = window.COLOR.GRAY_MEDIUM;

                menuItem.style.backgroundColor =
                    window.COLOR.GRAY_MEDIUM_DARKER;

                menuItem.style.color = window.COLOR.GRAY_MEDIUM_LIGHTEST;

                menuItem.unselectedBackgroundColor =
                    window.COLOR.GRAY_MEDIUM_DARKER;
            }

            darkModeMenuItem.innerText = "Light Mode";
        } else {
            for (const background of backgrounds) {
                background.setAttributeNS(null, "fill", window.COLOR.WHITE);

                background.setAttributeNS(
                    null,
                    "stroke",
                    window.COLOR.GRAY_LIGHTEST);
            }

            for (const menuItem of menuItems) {
                menuItem.selectedBackgroundColor = window.COLOR.GRAY_LIGHTER;
                menuItem.style.backgroundColor = window.COLOR.GRAY_LIGHTEST;
                menuItem.style.color = window.COLOR.GRAY_DARKER;
                menuItem.unselectedBackgroundColor = window.COLOR.GRAY_LIGHTEST;
            }

            darkModeMenuItem.innerText = "Dark Mode";
        }
    });

click_menuAddSeparator(viewMenu);

click_menuAddItem(
    viewMenu,
    undefined,
    "Full Screen",
    "F11",
    function (e) {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });
//#endregion View Menu

//#region Run Menu
const runIcon = document.createElementNS(svgNS, "svg");
runIcon.setAttributeNS(null, "viewBox", "0 0 256 256");

const runIconPath = document.createElementNS(svgNS, "path");
runIconPath.setAttributeNS(null, "d", "M57,8L215,128L57,248Z");
runIconPath.setAttributeNS(null, "fill", window.COLOR.GREEN_MEDIUM);
runIconPath.setAttributeNS(null, "stroke", window.COLOR.GREEN_DARKER);
runIconPath.setAttributeNS(null, "stroke-linejoin", "round");
runIconPath.setAttributeNS(null, "stroke-width", 16);
runIcon.appendChild(runIconPath);

const runMenu = click_menuAddButton(
    runIcon,
    "Run",
    "F5",
    function (e) {
        const iframe = document.createElement('iframe');

        const html = `<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8" />
    <meta name="author" content="Click Blocks" />
    <meta name="description" content="Made With Click Blocks" />
    <meta name="viewport" content="width=device-width" />
    <title>Click Debug</title>
    <style>
        body {
            background: radial-gradient(#404040, #202020);
            color: #F0F0F0;
            display: flex;
            flex-direction: column;
            font: 15px Helvetica;
            height: 100svh;
            margin: 0;
            padding: 0;
            width: 100vw;
        }

        progress {
            border: 0;
            height: 40px;
            margin: 20px;
            min-height: 40px;
            width: calc(100% - 40px);
        }

        span {
            bottom: 0;
            height: 40px;
            line-height: 40px;
            margin: 20px;
            overflow: hidden;
            position: absolute;
            text-align: center;
            text-overflow: ellipsis;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            white-space: nowrap;
            width: calc(100% - 40px);
        }

        svg {
            height: 100%;
            margin: 25svh 0 calc(25svh - 80px) 0;
            width: 100%;
        }
    </style>
</head>
<body>
    <svg viewBox="0 0 256 144">
        <path d="M199,98C212,-22,48,-22,57,98C41,298,215,298,199,98ZM57,98L199,98M128,8L128,98" fill="#FFFFFF" stroke="#000000" stroke-linejoin="round" stroke-width="16" transform="translate(0 53) scale(0.3359375)" />
        <text x="5" y="30" fill="#808080" font-size="12.5px" font-weight="900" textLength="76">Made With</text>
        <text x="93" y="93" fill="#7E0000" font-size="60px" font-style="italic" font-weight="900" textLength="150">Click</text>
        <text x="91" y="91" fill="#F10000" font-size="60px" font-style="italic" font-weight="900" textLength="150">Click</text>
        <text x="141" y="123" fill="#808080" font-size="30px" font-weight="900" textLength="100">Blocks</text>
    </svg>
    <progress value="1"></progress>
    <span>Please enable Javascript and WebAssembly</span>
</body>
</html>
`;

        iframe.srcdoc = html;

        click_popupShow(runIcon, "Click Debug", iframe, true);
    });
//#endregion Run Menu
//#endregion Click Menus

//#region Click Blocks
_click_titleSaved();
click_addBlock(
    40,
    10,
    window.COLOR.BLUE_MEDIUM,
    window.COLOR.BLUE_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    "false▾");
click_addBlock(
    40,
    50,
    window.COLOR.BLUE_MEDIUM,
    window.COLOR.BLUE_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    "false▾\ntrue▾");
click_addBlock(
    40,
    110,
    window.COLOR.BLUE_MEDIUM,
    window.COLOR.BLUE_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    "false▾\ntrue▾\nnull▾");
click_addBlock(
    170,
    10,
    window.COLOR.GREEN_MEDIUM,
    window.COLOR.GREEN_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    "-1.234567e-10");
click_addBlock(
    170,
    50,
    window.COLOR.GREEN_MEDIUM,
    window.COLOR.GREEN_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    "-1.234567e-10\n123");
click_addBlock(
    170,
    110,
    window.COLOR.GREEN_MEDIUM,
    window.COLOR.GREEN_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    "-1.234567e-10\n123\n∞");
click_addBlock(
    340,
    10,
    window.COLOR.RED_MEDIUM,
    window.COLOR.RED_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    "Hello, World!");
click_addBlock(
    340,
    50,
    window.COLOR.RED_MEDIUM,
    window.COLOR.RED_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    "Hello, World!\nHello, World!");
click_addBlock(
    340,
    110,
    window.COLOR.RED_MEDIUM,
    window.COLOR.RED_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    "Hello, World!\nHello, World!\nHello, World!");
click_addBlock(
    480,
    10,
    window.COLOR.ORANGE_MEDIUM,
    window.COLOR.ORANGE_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.SQUARE,
    window.SHAPE.NONE,
    window.SHAPE.SQUARE,
    "MyList");
click_addBlock(
    480,
    60,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.NONE,
    window.SHAPE.NONE,
    "Boolean▾ variable variable1");
click_addBlock(
    480,
    110,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "function Function1");
click_addBlock(
    480,
    170,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    "octagon hat");
click_addBlock(
    480,
    230,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.SQUARE,
    window.SHAPE.NONE,
    "hexagon hat");
click_addBlock(
    480,
    290,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.SQUARE,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    "square hat");
click_addBlock(
    40,
    180,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.INVERSE_HEXAGON,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "if",
    window.SHAPE.SQUARE,
    window.SHAPE.INVERSE_SQUARE,
    30);
click_addBlock(
    170,
    180,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "repeat",
    window.SHAPE.HEXAGON,
    window.SHAPE.INVERSE_HEXAGON,
    30);
click_addBlock(
    40,
    280,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.INVERSE_CIRCLE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "write",
    window.SHAPE.OCTAGON,
    window.SHAPE.INVERSE_OCTAGON,
    30);
click_addBlock(
    170,
    280,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.INVERSE_SQUARE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "clear",
    window.SHAPE.CIRCLE,
    window.SHAPE.INVERSE_CIRCLE,
    30);
click_addBlock(
    40,
    400,
    window.COLOR.PURPLE_MEDIUM,
    window.COLOR.PURPLE_DARKER,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.OCTAGON,
    window.SHAPE.NONE,
    "draw triangles▾");
click_addBlock(
    340,
    180,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_SQUARE,
    window.SHAPE.NONE,
    window.SHAPE.SQUARE,
    window.SHAPE.NONE,
    "square block");
click_addBlock(
    340,
    230,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.HEXAGON,
    window.SHAPE.NONE,
    "hexagon block");
click_addBlock(
    340,
    280,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.INVERSE_CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.CIRCLE,
    window.SHAPE.NONE,
    "circle block");
click_addBlock(
    340,
    330,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_SQUARE,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_HEXAGON,
    "");
click_addBlock(
    390,
    330,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_HEXAGON,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_OCTAGON,
    "");
click_addBlock(
    440,
    330,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_OCTAGON,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_CIRCLE,
    "");
click_addBlock(
    490,
    330,
    window.COLOR.GRAY_MEDIUM,
    window.COLOR.GRAY_DARKER,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_CIRCLE,
    window.SHAPE.NONE,
    window.SHAPE.INVERSE_SQUARE,
    "");
//#endregion Click Blocks
