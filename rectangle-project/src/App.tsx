import DrawingArea from "./Components/DrawingArea";

const App = () => {
  return (
    <div className="main" style={{display: 'flex', justifyContent: 'center', height: '100vh', width: '100vw'}} >
      <div style={{display:'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '800px', flexDirection: 'column'}}>
        <DrawingArea />
      </div>
    </div>
  );
};

export default App;
