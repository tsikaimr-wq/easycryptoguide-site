# Frontend Maintenance Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redirect all public frontend entry pages to a single maintenance notice while keeping admin pages accessible.

**Architecture:** Add one shared maintenance guard script and one dedicated maintenance page. Public HTML entry files load the guard immediately so users are redirected before normal app code runs.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript

---

### Task 1: Add the maintenance page and redirect guard

**Files:**
- Create: `G:\works\AdminecmainPRO\ECPROJECT-main\maintenance.html`
- Create: `G:\works\AdminecmainPRO\ECPROJECT-main\js\maintenance-guard.js`

- [ ] Create a standalone maintenance page with the user-provided notice.
- [ ] Create a guard script that redirects any non-maintenance frontend page to `maintenance.html`.

### Task 2: Attach the guard to public pages

**Files:**
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\index.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\login.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\signup.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\mobile.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\markets.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\trade.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\dashboard.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\fund.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\contract.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\delivery_chart.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\buy-sell.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\mine.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\multi-coin-order.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\rate.html`
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\tracker.html`

- [ ] Load the guard script near the start of each public page so redirect happens before normal UI logic.

### Task 3: Verify and publish

**Files:**
- Modify: `G:\works\AdminecmainPRO\ECPROJECT-main\docs\superpowers\specs\2026-05-08-frontend-maintenance-mode-design.md`

- [ ] Verify public pages redirect to `maintenance.html`.
- [ ] Verify admin pages remain accessible.
- [ ] Commit and push the changes.
