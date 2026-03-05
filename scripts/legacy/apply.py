import os

with open('mobile.html', 'r', encoding='utf-8') as f:
    text = f.read()

screen_html = """                </div>
            </div>

            <!-- TERMS OF SERVICE SCREEN -->
            <div id="termsOfServiceScreen" class="screen hidden" style="background:#fff; display:flex; flex-direction:column;">
                <div class="profile-top-bar" style="border-bottom: 1px solid #f9f9f9; display: flex; align-items: center; justify-content: center; position: relative;">
                    <span onclick="goBack()" style="cursor:pointer; position: absolute; left: 16px; font-size: 20px;">&lt;</span>
                    <span style="font-size: 18px; font-weight: 700; color: #1a0b2e;">Terms of Service</span>
                </div>
                <div class="scroll-area" style="flex:1; overflow-y:auto; padding: 24px 16px;">
                    <h2 style="font-size: 22px; font-weight: normal; margin-bottom: 32px; color: #333; text-align: center; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Terms and Conditions of use – AU</h2>
                    
                    <div style="text-align: left; margin-bottom: 24px;">
                        <img src="./assets/images/easycrypto_logo_purple.png" alt="easy crypto" style="width: 64px; height: 64px; border-radius: 12px;" onerror="this.style.display='none';">
                    </div>

                    <p style="color: #666; font-size: 14px; line-height: 1.4; margin-bottom: 16px; font-family: Garamond, serif;">Written by Easy Crypto<br>Updated over a week ago</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">Easy Crypto – Terms and Conditions of use (Australia – www.easyexr.com)</p>

                    <p style="color: #111; font-weight: bold; font-style: italic; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">In using our platform, you confirm that you are authorised to provide the personal details presented and consent to the information being checked with the document issuer or official record holder via third party systems for the purpose of identity verification.</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">These terms and conditions of use (the "Terms") apply to you when you access and use the Platform and the Services (as defined below) that are offered by EC Systems Pty Ltd, trading as Easy Crypto, and set out how you may use and access the Platform and the Services.</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">By accessing the Platform and/or Services and/or creating a User Account, you are agreeing to these Terms and entering into a legally binding agreement with Easy Crypto. In particular, you are acknowledging and agreeing that you have read and understood the "Risks of Trading and/or Holding Digital Currency" section in clause 3 below. If you do not agree to these Terms, you must not create a User Account and must cease using our Platform and Services immediately.</p>

                    <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 16px; color: #444; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">1. The Platform and the Services</h3>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">1.1 The website <a href="http://www.easycrypto-p.com" style="color: #0d82ff; text-decoration: underline;">www.easycrypto-p.com</a>, together with its related mobile applications, (collectively the "Platform") is operated by EC Systems Pty Ltd, ABN 17624780409. In these Terms and Conditions, "Easy Crypto", "we", "us" or "our" means EC Systems Pty Ltd, and any reference to "you" or "your" means you, the person or entity who accesses and/or uses the Platform and/or the Services.</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">1.2 The Platform enables individuals who sign up to use our services to acquire digital currency (which may also be known as cryptocurrencies, e-money, virtual money, alt-coins) (together, "Digital Currency"). Our services include the purchase, exchange and creation of portfolios of Digital Currency using the Platform (collectively the "Services").</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">1.3 As part of the Services, we may provide you with a portfolio, which is a digitally-secured file that may contain one or more Digital Currencies. This encrypted file and/or any Digital Currencies contained within are collectively referred to as the "Portfolio" in these Terms.</p>

                    <h3 style="font-size: 16px; font-weight: normal; margin-bottom: 16px; color: #444; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">2. Registration and Eligibility</h3>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">2.1 If you wish to access and receive the Services, you must create an account in accordance with the requirements of the Platform (a "User Account").</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">2.2 You may only create a User Account:</p>

                    <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 24px; margin-left:16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">1.if you are at least 18 years old;</p>
                </div>
            </div>


            <!-- DEPOSIT SECTION -->"""

if 'id="termsOfServiceScreen"' not in text:
    old_target = '                </div>\n\n\n                <!-- DEPOSIT SECTION -->'
    if old_target in text:
        text = text.replace(old_target, screen_html)
        print('Screen html injected!')
    else:
        print('Could not find exact deposit section marker!')
        import re
        text = re.sub(r'\s+</div>\s+<!-- DEPOSIT SECTION -->', '\n' + screen_html.replace('            <!-- DEPOSIT SECTION -->', '                <!-- DEPOSIT SECTION -->'), text)

with open('mobile.html', 'w', encoding='utf-8') as f:
    f.write(text)
