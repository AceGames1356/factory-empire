const {app,BrowserWindow,Tray,Menu,nativeImage}=require('electron');
const path=require('path');
let win,tray,quitting=false;
if(!app.requestSingleInstanceLock()){app.quit()}
app.on('second-instance',()=>show());
function show(){if(!win)return;win.show();win.focus()}
function create(){
  win=new BrowserWindow({width:1100,height:780,minWidth:360,minHeight:560,backgroundColor:'#0f1330',title:'Factory Empire',autoHideMenuBar:true,
    icon:path.join(__dirname,'icon.png'),
    webPreferences:{backgroundThrottling:false,contextIsolation:true}});
  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
  // closing the window keeps the game running in the tray
  win.on('close',e=>{if(!quitting){e.preventDefault();win.hide()}});
}
function makeTray(){
  tray=new Tray(nativeImage.createFromPath(path.join(__dirname,'icon.png')).resize({width:16,height:16}));
  tray.setToolTip('Factory Empire - running');
  const menu=()=>Menu.buildFromTemplate([
    {label:'Open Factory Empire',click:show},
    {label:'Start with Windows',type:'checkbox',checked:app.getLoginItemSettings().openAtLogin,click:i=>app.setLoginItemSettings({openAtLogin:i.checked})},
    {type:'separator'},
    {label:'Quit',click:()=>{quitting=true;app.quit()}}]);
  tray.setContextMenu(menu());
  tray.on('click',show);
}
app.whenReady().then(()=>{create();makeTray()});
app.on('before-quit',()=>{quitting=true});
