import { SideBarItem} from "../../components/SideBarItem";
import { FaHome } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import { MdArrowOutward } from "react-icons/md";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex">
        <div className="w-72 border-r border-slate-300 min-h-screen mr-4 pt-28">
            <div>
                <SideBarItem href={"/dashboard"} icon={<FaHome />} title="Home" />
                <SideBarItem href={"/transfer"} icon={<FaMoneyBillTransfer />} title="Transfer" />
                <SideBarItem href={"/transactions"} icon={<GrTransaction />} title="Transactions" />
                <SideBarItem  href={"/p2p"} icon={<MdArrowOutward />} title="P2PTransaction"/>
            </div>
        </div>
            {children}
    </div>
  );
}