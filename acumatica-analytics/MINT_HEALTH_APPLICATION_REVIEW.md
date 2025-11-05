# Mint Health - Application Review & Business Alignment

## 🏥 Mint Health's Actual Business Operations

### Core Business Model

**1. PHARMA (Pharmaceutical Distribution)**
- Represents and distributes pharmaceutical brands in Malta
- B2B to hospitals, clinics, pharmacies
- B2G via government tenders (CPSU - Central Procurement & Supplies Unit)
- 500 SKUs, 30 suppliers, multiple customers
- GDP-licensed warehousing (1200m², temp-controlled)

**2. WELLNESS (Health & Wellness Products)**
- Online shop at mint.com.mt
- B2C direct to consumers
- Vitamins, supplements, nutrition, baby care, COVID products
- Self-care and preventive health focus

**3. PHARMACY (Mint Care Pharmacy)**
- Community pharmacy - retail operations
- Direct patient care
- Healthcare services team
- B2C walk-in customers

### Additional Services
- **GDP/WDL Licensing & RP Services** - Regulatory compliance support
- **Relabelling Services** - GMP license for secondary packaging
- **Warehousing** - 3PL services for other pharmaceutical companies

---

## ✅ What's Currently Working

### Application Status: **LIVE & RUNNING**
- Acumatica API: http://localhost:3001 ✅
- Analytics API: http://localhost:3002 ✅
- Frontend: http://localhost:3000 ✅

### Data Generated: **2,945 Malta-Specific Records**
- 80 Customers (Mater Dei Hospital, St. James, Guardian Pharmacy, etc.)
- 50 Products (Pharma + Wellness categories)
- 15 Suppliers (Pfizer, GSK, AstraZeneca, etc.)
- 600 Sales Orders, 700 Invoices, 500 Payments
- Malta locations, +356 phones, EUR currency

### Dashboards Built (6 Active):
1. ✅ **Executive Dashboard** - Overall KPIs
2. ✅ **Financial Analytics** - Revenue, AR aging, profitability
3. ✅ **Sales Analytics** - Sales performance, pipeline
4. ✅ **Customer Analytics** - RFM segmentation, CLV
5. ✅ **Inventory Analytics** - Stock levels, turnover, alerts
6. ✅ **Cash Flow Forecast** - 30/60/90 day projections

### Dashboard Created But NOT Connected:
7. ⚠️ **Forecasting Dashboard** - Created but not in navigation menu

---

## 🎯 Gaps & Missing Features for Mint Health

### Critical Gaps

#### 1. **Forecasting Dashboard Not Accessible** ⚠️
**Issue:** Created `ForecastingDashboard.js` but not added to App.js routing
**Impact:** Users can't access the key forecasting feature
**Fix Needed:**
- Add import to App.js
- Add route `/forecasting`
- Add sidebar navigation link

#### 2. **No Backend for Forecasting Dashboard** ⚠️
**Issue:** Frontend calls these APIs but they don't exist:
- `/api/analytics/forecasting?businessUnit={unit}`
- `/api/analytics/tenders`

**Impact:** Forecasting dashboard will show loading spinner forever
**Fix Needed:**
- Create `forecastingEngine.js` with rolling average calculations
- Add API endpoints to `server.js`
- Generate mock forecasting data with expiry dates

#### 3. **Missing Government Tender Tracking** ⚠️
**Business Need:** 47 active COOs with CPSU need tracking
**Current State:** Data structure exists but no real tender data
**Fix Needed:**
- Add tender/COO entities to data model
- Generate 47 sample government tenders
- Track delivery schedules, CPSU stock levels

#### 4. **No Expiry Date Tracking** ⚠️
**Business Need:** Critical for pharmaceuticals (prevent losses)
**Current State:** StockItem has placeholder dates
**Fix Needed:**
- Add realistic expiry dates to products
- Create expiry alert system (30/60/90 days)
- Calculate months to expiry
- Recommend actions (discount/return/promote)

#### 5. **Missing Business Unit Segmentation** ⚠️
**Business Need:** Separate PHARMA / WELLNESS / PHARMACY operations
**Current State:** All products mixed together
**Fix Needed:**
- Tag products by domain (PHARMA/WELLNESS/PHARMACY)
- Filter data by business unit
- Separate analytics per domain

---

## 📊 What Mint Health Actually Needs

### Priority 1: Operational Dashboards

#### **Forecasting & Demand Planning** (CRITICAL)
**Use Case:** Procurement team needs to know what to reorder
**Features Needed:**
- [ ] Rolling 3-month average by product
- [ ] Months of stock calculation
- [ ] Reorder recommendations (< 2 months = urgent)
- [ ] Expiry alerts (< 60 days)
- [ ] Suggested PO quantities
- [ ] Filter by PHARMA/WELLNESS/PHARMACY

**Users:** Procurement Manager, Warehouse Manager

#### **Government Tender Management** (HIGH PRIORITY)
**Use Case:** Track 47 active CPSU contracts
**Features Needed:**
- [ ] COO tracking (reference, product, quantities)
- [ ] Delivery schedule management
- [ ] CPSU stock level monitoring
- [ ] Next delivery alerts
- [ ] Tender performance metrics
- [ ] Compliance reporting

**Users:** Government Tender Manager, Logistics Coordinator

#### **Warehouse Operations Dashboard** (HIGH PRIORITY)
**Use Case:** Daily warehouse management
**Features Needed:**
- [ ] Pick list generation
- [ ] Stock location tracking
- [ ] Expiry date scanning
- [ ] Batch/lot management
- [ ] Temperature monitoring integration
- [ ] GDP compliance tracking

**Users:** Warehouse Staff, Quality Manager

### Priority 2: Strategic Dashboards

#### **Multi-Channel Performance** (MEDIUM)
**Use Case:** Compare PHARMA vs WELLNESS vs PHARMACY performance
**Features Needed:**
- [ ] Revenue by channel
- [ ] Profitability by domain
- [ ] Customer acquisition cost
- [ ] Inventory turns by category
- [ ] Cross-sell opportunities

**Users:** CEO, Business Development Manager

#### **Supplier Performance** (MEDIUM)
**Use Case:** Evaluate 30+ pharmaceutical suppliers
**Features Needed:**
- [ ] On-time delivery rates
- [ ] Quality issues tracking
- [ ] Price variance analysis
- [ ] Lead time trends
- [ ] Supplier scorecards

**Users:** Procurement Manager, Quality Manager

#### **Regulatory Compliance Dashboard** (MEDIUM)
**Use Case:** GDP/WDL/GMP compliance tracking
**Features Needed:**
- [ ] License expiry alerts
- [ ] Audit readiness status
- [ ] Temperature excursion logs
- [ ] Batch recall tracking
- [ ] Documentation completeness

**Users:** Quality Manager, Regulatory Affairs

### Priority 3: Customer-Facing

#### **Customer Portal** (LOW - Future)
**Use Case:** Pharmacies/clinics order online
**Features:** Product catalog, order history, delivery tracking

#### **CPSU Portal** (LOW - Future)
**Use Case:** Government visibility into tender fulfillment
**Features:** COO status, stock levels, delivery schedules

---

## 🔧 Immediate Fixes Needed (This Session)

### Fix 1: Connect Forecasting Dashboard ⚡ CRITICAL
**Steps:**
1. Update App.js - add import and route
2. Add navigation link to sidebar
3. Create mock forecasting API endpoints
4. Generate sample data with expiry dates
5. Test the dashboard loads

### Fix 2: Update Branding 🎨
**Current:** "Acumatica Analytics"
**Should Be:** "Mint Health Analytics"
**Impact:** Professional appearance for demos

### Fix 3: Add Business Unit Context 🏢
**Current:** Generic pharmaceutical data
**Should Be:** Tagged PHARMA/WELLNESS/PHARMACY
**Impact:** Proper segmentation for decision-making

### Fix 4: Generate Realistic Tenders 📋
**Current:** No government tender data
**Should Be:** 47 sample COOs with Malta government
**Impact:** Demo the tender tracking feature

---

## 🎯 Recommended Implementation Plan

### Session 1 (NOW): Make It Work
- [ ] Fix routing - add Forecasting to menu
- [ ] Create mock forecasting API
- [ ] Update branding to "Mint Health"
- [ ] Generate tender data
- [ ] Add expiry dates to products

### Session 2: Make It Real
- [ ] Connect to actual Acumatica API
- [ ] Implement real rolling averages
- [ ] Set up data sync schedules
- [ ] Add user authentication
- [ ] Configure for production

### Session 3: Make It Complete
- [ ] Add warehouse dashboard
- [ ] Build supplier performance
- [ ] Create compliance tracking
- [ ] Add mobile responsiveness
- [ ] Deploy to cloud

---

## 📝 Data Quality Check

### Current Data Quality: ✅ GOOD

**Strengths:**
- Real Malta customer names (Mater Dei, St. James, Guardian, Boots)
- Authentic product names (Atorvastatin, Metformin, Ventolin, etc.)
- Realistic suppliers (Pfizer, GSK, AstraZeneca)
- Malta-specific (Valletta, Sliema, +356, MLT postcodes)
- Proper pharmaceutical categories

**Needs Improvement:**
- Add expiry dates (currently generic future dates)
- Add batch/lot numbers for traceability
- Add temperature requirements (2-8°C, 15-25°C, etc.)
- Tag by business unit (PHARMA/WELLNESS/PHARMACY)
- Add tender/COO data for government contracts

---

## 🎬 Demo Scenario for Mint Health

### Scenario: Morning Operations Meeting

**Attendees:** CEO, CFO, Procurement Manager, Tender Manager

#### **1. Executive Dashboard** (2 min)
"Here's our business health at a glance:
- €78.5M total revenue, €2.3M this month
- €32.8M outstanding AR, 45-day DSO
- €3.2M inventory, 80 active customers
- €31.8M weighted pipeline"

#### **2. Financial Dashboard** (2 min)
"Revenue growing steadily, but we have €15.8M overdue:
- AR aging shows most in 1-30 day bucket
- Need to focus on 90+ day collections
- Gross margin at 31.2% - healthy"

#### **3. Forecasting Dashboard** (3 min) ⚠️ NOT ACCESSIBLE YET
"For procurement planning:
- 38 items need reordering (< 2 months stock)
- 15 items expiring in next 60 days - promote now
- Suggested POs ready for 5 suppliers
- Government: 47 tenders on track, next delivery next week"

#### **4. Inventory Dashboard** (2 min)
"Warehouse status:
- €3.2M total value
- 38 low stock alerts
- 15 dead stock items to clear (€42K value)
- Best movers: Atorvastatin, Metformin, Amoxicillin"

#### **5. Customer Dashboard** (2 min)
"Customer intelligence:
- Champions: Mater Dei, St. James generating €15M
- At Risk: 21 customers need attention
- Segmentation helps target marketing"

**Total Demo:** 11 minutes, covers full business

---

## 🚀 Next Actions

### Immediate (Right Now):
1. **Fix Forecasting Dashboard routing**
2. **Create forecasting API endpoints**
3. **Update branding to "Mint Health"**
4. **Add business unit tags**

### Short Term (Next Session):
5. Generate government tender data (47 COOs)
6. Add expiry dates with alerts
7. Build warehouse operations view
8. Add supplier performance tracking

### Medium Term (Future):
9. Connect to real Acumatica
10. Implement ML forecasting
11. Add mobile app
12. Build customer portal

---

## 💡 Key Insights for Mint Health

### What Makes Them Unique:
1. **Multi-channel** - B2B (pharma), B2G (tenders), B2C (pharmacy, wellness)
2. **Regulatory** - GDP/WDL/GMP licensed, audit-ready
3. **Malta-focused** - Know every pharmacy, clinic, hospital
4. **Services** - Not just distribution, also licensing help & relabelling
5. **Cold chain** - Handle biologicals, vaccines, temperature-sensitive

### What Analytics Can Do:
1. **Prevent stockouts** - Keep pharmacies supplied
2. **Minimize expiry** - €50K+ annual savings potential
3. **Track tenders** - Ensure government contract compliance
4. **Optimize inventory** - Free up €200K+ working capital
5. **Understand customers** - Who buys what, when, why

### Competitive Advantage:
- **Data-driven** - Make decisions based on facts, not gut feel
- **Proactive** - Get alerts before problems occur
- **Efficient** - Automate manual Excel work
- **Professional** - Impress customers and suppliers
- **Scalable** - Grow without proportional admin overhead

---

## ✅ Conclusion

**Current State:** Good foundation, core analytics working, Malta-specific data loaded

**Critical Gap:** Forecasting dashboard not accessible (this is what Mint needs most!)

**Recommendation:** Fix routing and APIs immediately, then add tender tracking and expiry management

**Timeline:**
- Fix routing: 5 minutes
- Add APIs: 30 minutes
- Generate tender data: 20 minutes
- Add expiry logic: 20 minutes
**Total: ~75 minutes to complete**

Let's do it! 🚀
