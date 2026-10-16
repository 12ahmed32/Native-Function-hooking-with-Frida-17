// ===== Configuration =====
var moduleName = "libFridaEight.so";      // module to look in
var functionName = "Java_com_mobilehackinglab_FridaEight_MainActivity_strCmp";       // function (export) name

// ===== Resolve address =====
function getFunctionAddress(modName, funcName) {
    // Method 1: direct export lookup (works on Frida 16 and 17)
    var mod = Process.findModuleByName(modName);
    if (mod === null) {
        console.log("[-] Module not found: " + modName);
        return null;
    }

    var addr = mod.findExportByName(funcName);
    if (addr !== null) {
        console.log("[+] " + modName + "!" + funcName + " @ " + addr);
        console.log("    module base : " + mod.base);
        console.log("    offset      : 0x" + addr.sub(mod.base).toString(16));
        return addr;
    }

    // Method 2: fall back to symbols (non-exported / internal functions)
    var sym = mod.enumerateSymbols().filter(function (s) {
        return s.name === funcName;
    })[0];

    if (sym !== undefined) {
        console.log("[+] (symbol) " + modName + "!" + funcName + " @ " + sym.address);
        console.log("    offset      : 0x" + sym.address.sub(mod.base).toString(16));
        return sym.address;
    }

    console.log("[-] Function not found: " + funcName + " in " + modName);
    return null;
}

var address = getFunctionAddress(moduleName, functionName);

/////////////////////////////////////////



