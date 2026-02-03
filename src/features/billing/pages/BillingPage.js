"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Tabs = require("@radix-ui/react-tabs");
var lucide_react_1 = require("lucide-react");
var PlanCard_1 = require("../components/PlanCard");
var InvoiceTable_1 = require("../components/InvoiceTable");
var types_1 = require("../types");
var button_1 = require("@/components/ui/button");
var utils_1 = require("@/lib/utils");
// Mock current plan ID (giả sử lấy từ API)
var CURRENT_PLAN_ID = 'plan_pro';
var BillingPage = function () {
    // Lấy trạng thái compact từ context (giả định)
    var isCompact = false;
    var _a = (0, react_1.useState)('plans'), activeTab = _a[0], setActiveTab = _a[1];
    // --- UI Components cho Tab Payment Method (Inline để gọn file) ---
    var PaymentMethodCard = function (_a) {
        var method = _a.method;
        return (<div className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
          {method.type}
        </div>
        <div>
          <p className="font-medium text-foreground">•••• •••• •••• {method.last4}</p>
          <p className="text-xs text-muted-foreground">Hết hạn {method.expiry}</p>
        </div>
      </div>
      {method.isDefault ? (<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">Mặc định</span>) : (<button_1.Button variant="ghost" size="sm" className="text-xs h-7">Đặt làm mặc định</button_1.Button>)}
    </div>);
    };
    return (<div className="container mx-auto max-w-6xl py-6 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Thanh toán & Gói cước</h1>
            <p className="text-muted-foreground mt-1">Quản lý gói đăng ký hiện tại và lịch sử giao dịch của bạn.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Kỳ thanh toán tiếp theo: 01/11/2023
          </div>
        </div>

        {/* Tabs System using Radix UI */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-6">
          <Tabs.List className="flex border-b border-border w-full overflow-x-auto">
            <Tabs.Trigger value="plans" className={(0, utils_1.cn)("group flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-all hover:text-primary outline-none focus-visible:ring-2 ring-primary ring-offset-2", "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5")}>
              <lucide_react_1.Layout className="w-4 h-4"/>
              Gói hiện tại
            </Tabs.Trigger>
            <Tabs.Trigger value="invoices" className={(0, utils_1.cn)("group flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-all hover:text-primary outline-none focus-visible:ring-2 ring-primary ring-offset-2", "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5")}>
              <lucide_react_1.History className="w-4 h-4"/>
              Lịch sử thanh toán
            </Tabs.Trigger>
            <Tabs.Trigger value="payment" className={(0, utils_1.cn)("group flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-transparent transition-all hover:text-primary outline-none focus-visible:ring-2 ring-primary ring-offset-2", "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-primary/5")}>
              <lucide_react_1.CreditCard className="w-4 h-4"/>
              Phương thức thanh toán
            </Tabs.Trigger>
          </Tabs.List>

          {/* TAB 1: PLANS */}
          <Tabs.Content value="plans" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {types_1.MOCK_PLANS.map(function (plan) { return (<PlanCard_1.PlanCard key={plan.plan_id} plan={plan} isCurrent={plan.plan_id === CURRENT_PLAN_ID} isCompact={isCompact} onUpgrade={function (id) { return console.log('Upgrade to:', id); }}/>); })}
            </div>
            
            <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-dashed text-center">
              <h3 className="font-semibold text-foreground">Bạn cần gói tùy chỉnh cho Doanh nghiệp lớn?</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Chúng tôi cung cấp giải pháp Private Cloud, SLA riêng biệt và Hỗ trợ tận nơi.</p>
              <button_1.Button variant="secondary">Liên hệ bộ phận Sales</button_1.Button>
            </div>
          </Tabs.Content>

          {/* TAB 2: INVOICES */}
          <Tabs.Content value="invoices" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Hóa đơn gần đây</h2>
                <button_1.Button variant="secondary" size="sm">
                  <lucide_react_1.Download className="w-4 h-4 mr-2"/> Tải tất cả
                </button_1.Button>
              </div>
              <InvoiceTable_1.InvoiceTable invoices={types_1.MOCK_INVOICES} isCompact={isCompact}/>
            </div>
          </Tabs.Content>

          {/* TAB 3: PAYMENT METHODS */}
          <Tabs.Content value="payment" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Thẻ đã lưu</h2>
                <div className="space-y-3">
                  {types_1.MOCK_PAYMENT_METHODS.map(function (method) { return (<PaymentMethodCard key={method.id} method={method}/>); })}
                </div>
                <button_1.Button className="w-full mt-2" variant="secondary">
                  <lucide_react_1.Plus className="w-4 h-4 mr-2"/> Thêm phương thức thanh toán mới
                </button_1.Button>
              </div>

              <div className="p-6 border rounded-xl bg-muted/20 h-fit">
                <h2 className="text-lg font-semibold mb-4">Thông tin xuất hóa đơn</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">Tên công ty / Cá nhân</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="PronaFlow Technology Ltd."/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">Mã số thuế</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="0101234567"/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">Email nhận hóa đơn</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" defaultValue="billing@pronaflow.com"/>
                  </div>
                  <button_1.Button type="submit" className="w-full">Cập nhật thông tin</button_1.Button>
                </form>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>);
};
div >
;
;
;
exports.default = BillingPage;
