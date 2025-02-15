import Signup from "./pages/User/SignUp";
import Login from "./pages/User/Login";
import EditPage from "./pages/Editpage";
import Invite from "./pages/Invite";
import MyPage from "./pages/Mypage";
import PaymentStatus from "./pages/PaymentStatus";
import Transfer from "./pages/Transfer";
import TransferRecieve from "./pages/TransferRecive";
import TransferSend from "./pages/TransferSend";
import MainPage from "./pages/Main/MainPage";
import CreateRoom from "./pages/Room/CreateRoom";
import RoomDetail from "./pages/Room/RoomDetail";
import MoneyRecord from "./pages/Money/MoneyRecord";
import MoneyRecordDetail from "./pages/Money/MoneyRecordDetail";
import StartSettlement from "./pages/Room/StartSettlement";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

function App() {
  return (
    <Router className="App">
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} /> 

        <Route path="/main" element={<MainPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/transfer-recieve" element={<TransferRecieve />} />
        <Route path="/transfer-send" element={<TransferSend />} />

        <Route path="/create-room" element={<CreateRoom/>} />
        <Route path="/room-detail" element={<RoomDetail />} />
        <Route path="/money-record" element={<MoneyRecord />} />
        <Route path="/money-record-detail" element={<MoneyRecordDetail />} />
        <Route path="/start-settlement" element={<StartSettlement />} />
      </Routes>
    </Router>
  );
}

export default App;
