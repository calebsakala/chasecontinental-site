// Universal Chatbot System for Chase Continental
class SmartChatbot {
    constr                  <div id="chatbot-button" class="chatbot-button" style="display: none;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.svg/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.18 22 14.34 21.84 15.42 21.54L20 23L18.46 18.58C21.16 16.74 22 14.1 22 12C22 6.48 17.52 2 12 2ZM8 11H10V13H8V11ZM14 13H16V11H14V13Z" fill="currentColor"/>
                </svg>
            </div>get.innerHTML = `
            <div id="chatbot-button" class="chatbot-button" style="display: none;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.18 22 14.34 21.84 15.42 21.54L20 23L18.46 18.58C21.16 16.74 22 14.1 22 12C22 6.48 17.52 2 12 2ZM8 11H10V13H8V11ZM14 13H16V11H14V13Z" fill="currentColor"/>
                </svg>
            </div>`;) {
        this.isOpen = false;
        this.hasAppeared = false;
        this.responses = {
            services: {
                text: "We provide AI automation and business intelligence services including:\n• Business process mapping and audit\n• AI agent development and deployment\n• System integration with your existing tools\n• Data pipeline creation and BI dashboards\n• Ongoing support and maintenance",
                followUp: ["cost", "timeline", "examples"]
            },
            cost: {
                text: "Our pricing structure:\n• Implementation & Automation Audit: $3k-$8k\n• Agent Studio (Build & Deploy): $8k-$40k\n• Business Intelligence & Dashboards: Contact for quote\n• Migration & Integrations: Scoped per project\n\nTypically less than one mid-level analyst costs per year, but your system works 24/7.",
                followUp: ["timeline", "roi", "contact"]
            },
            timeline: {
                text: "Implementation timeline:\n• Automation Audit: 2 weeks\n• Agent Development: 2-8 weeks\n• BI Dashboards: 1-4 weeks\n• You see results from day one of deployment\n\nMost projects deliver measurable ROI within 30-60 days.",
                followUp: ["cost", "process", "contact"]
            },
            fit: {
                text: "You're a great fit if you:\n• Have repetitive processes eating up team time\n• Want results in weeks, not years\n• Need better visibility into your operations\n• Are ready to embrace AI transformation\n\nNot suitable for: one-person operations or companies not ready for change.",
                followUp: ["services", "contact", "examples"]
            },
            examples: {
                text: "Recent transformation projects:\n• CCID Cape Town: Research operation automation (75% error reduction)\n• Heineken: Waste management data pipeline (60% faster tracking)\n• Greenway: Circularity data platform development",
                followUp: ["services", "contact", "case-studies"]
            },
            roi: {
                text: "Typical client results:\n• 15-40+ hours saved per week per team member\n• 20-40% reduction in operational labor costs\n• Reporting cycles: weeks → hours\n• Real-time BI dashboards (no more Excel chaos)\n• 75%+ reduction in manual errors",
                followUp: ["timeline", "contact", "process"]
            },
            process: {
                text: "Our proven 4-step approach:\n1. Discovery (free 30-min consultation)\n2. Mapping (workflow analysis & automation opportunities)\n3. Prototype (working MVP in weeks)\n4. Deploy & Support (production-ready with ongoing maintenance)",
                followUp: ["contact", "timeline", "cost"]
            },
            contact: {
                text: "Ready to transform your operations?\n• Book a free Discovery Call (30 minutes)\n• We'll analyze your workflows\n• Get a custom automation proposal\n• See measurable results in 30-60 days",
                followUp: ["book-call"]
            },
            "case-studies": {
                text: "Explore our detailed case studies showing real transformations for companies like CCID, Heineken, Greenway, and others. Each case study includes the challenge, our solution, and measurable impact.",
                followUp: ["contact", "services"],
                action: "redirect",
                url: "use-cases.html"
            },
            "book-call": {
                text: "Perfect! Let's schedule your free Discovery Call. You'll get personalized insights into your automation opportunities and a clear roadmap forward.",
                action: "redirect",
                url: "https://calendly.com/charles-chasecontinental/chase-continental-discovery-call"
            },
            faq: {
                text: "Browse our comprehensive FAQ section with detailed answers to common questions about AI automation, implementation, pricing, and more!",
                action: "redirect",
                url: "faq.html"
            }
        };
        
        this.init();
    }

    init() {
        // Check if chatbot already appeared in this session
        if (sessionStorage.getItem('chatbot-appeared')) {
            this.hasAppeared = true;
            this.createChatbotWidget();
            this.showWidget();
        } else {
            this.createChatbotWidget();
            this.hideWidget();
            this.startTimer();
        }
        
        this.bindEvents();
    }

    createChatbotWidget() {
        // Only create if it doesn't exist
        if (document.getElementById('smart-chatbot-widget')) return;
        
        const widget = document.createElement('div');
        widget.id = 'smart-chatbot-widget';
        widget.className = 'chatbot-widget';
        widget.innerHTML = `
            <div id="chatbot-button" class="chatbot-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.18 22 14.34 21.84 15.42 21.54L20 23L18.46 18.58C21.16 16.74 22 14.1 22 12C22 6.48 17.52 2 12 2ZM8 11H10V13H8V11ZM14 13H16V11H14V13Z" fill="currentColor"/>
                </svg>
            </div>
            
            <div id="chatbot-panel" class="chatbot-panel" style="display: none;">
                <div class="chatbot-header">
                    <h4>Chase Continental Assistant</h4>
                    <button id="chatbot-close" class="chatbot-close">×</button>
                </div>
                
                <div class="chatbot-content">
                    <div id="chatbot-messages" class="chatbot-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chatbot-input-area">
                        <input type="text" id="chatbot-input" placeholder="Ask a question..." />
                        <button id="chatbot-send">Send</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
    }

    hideWidget() {
        const widget = document.getElementById('smart-chatbot-widget');
        if (widget) widget.style.display = 'none';
    }

    showWidget() {
        const widget = document.getElementById('smart-chatbot-widget');
        if (widget) {
            widget.style.display = 'block';
            widget.classList.add('chatbot-appear');
        }
    }

    startTimer() {
        // Show chatbot after 30 seconds if not already shown
        setTimeout(() => {
            if (!this.hasAppeared) {
                this.appearChatbot();
            }
        }, 30000);
    }

    appearChatbot() {
        this.hasAppeared = true;
        sessionStorage.setItem('chatbot-appeared', 'true');
        
        this.showWidget();
        
        // Auto-open the chat panel with greeting after a short delay
        setTimeout(() => {
            this.isOpen = true;
            document.getElementById('chatbot-panel').style.display = 'block';
            document.getElementById('chatbot-button').classList.add('active');
            this.addWelcomeMessage();
        }, 1000);
    }

    addWelcomeMessage() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
        
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'chatbot-message bot-message';
        welcomeDiv.innerHTML = `
            <p class="typewriter-text" id="welcome-message"></p>
            <div class="quick-options" style="display: none; opacity: 0;">
                <button class="option-btn" data-question="services">What services do you offer?</button>
                <button class="option-btn" data-question="cost">How much does it cost?</button>
                <button class="option-btn" data-question="timeline">How long does it take?</button>
                <button class="option-btn" data-question="faq">View all FAQs</button>
            </div>
        `;
        messagesContainer.appendChild(welcomeDiv);
        
        // Start typing the welcome message
        this.typeMessage("👋 Hi there! I noticed you've been exploring our site. How can we help with your transformation journey?", 'welcome-message');
    }

    typeMessage(text, elementId, speed = 50) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let index = 0;
        element.textContent = '';
        
        // Remove cursor after typing is done
        const removeCursor = () => {
            element.classList.remove('typewriter-text');
        };
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                setTimeout(removeCursor, 500);
                
                // Show options after message is complete
                const options = element.parentNode.querySelector('.quick-options');
                if (options) {
                    options.style.display = 'flex';
                    setTimeout(() => {
                        options.style.transition = 'opacity 0.3s ease';
                        options.style.opacity = '1';
                    }, 200);
                }
            }
        }, speed);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'chatbot-button') {
                this.toggleChat();
            } else if (e.target.id === 'chatbot-close') {
                this.toggleChat();
            } else if (e.target.id === 'chatbot-send') {
                this.sendMessage();
            } else if (e.target.classList.contains('option-btn')) {
                const question = e.target.dataset.question;
                this.handleQuickOption(question, e.target.textContent);
            }
        });

        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'chatbot-input' && e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const panel = document.getElementById('chatbot-panel');
        const button = document.getElementById('chatbot-button');
        
        if (this.isOpen) {
            panel.style.display = 'block';
            button.classList.add('active');
            
            // Add welcome message if no messages exist
            const messages = document.getElementById('chatbot-messages');
            if (messages.children.length === 0) {
                this.addWelcomeMessage();
            }
        } else {
            panel.style.display = 'none';
            button.classList.remove('active');
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            
            const response = this.getResponse(message.toLowerCase());
            setTimeout(() => {
                this.addMessage(response.text, 'bot', response.followUp);
                if (response.action === 'redirect') {
                    setTimeout(() => {
                        window.open(response.url, response.url.startsWith('http') ? '_blank' : '_self');
                    }, 2000);
                }
            }, 1000);
        }
    }

    handleQuickOption(question, displayText) {
        this.addMessage(displayText, 'user');
        const response = this.responses[question] || this.responses.contact;
        
        setTimeout(() => {
            this.addMessage(response.text, 'bot', response.followUp);
            if (response.action === 'redirect') {
                setTimeout(() => {
                    window.open(response.url, response.url.startsWith('http') ? '_blank' : '_self');
                }, 2000);
            }
        }, 1000);
    }

    getResponse(message) {
        // Enhanced keyword matching
        if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) return this.responses.services;
        if (message.includes('cost') || message.includes('price') || message.includes('much') || message.includes('expensive')) return this.responses.cost;
        if (message.includes('time') || message.includes('long') || message.includes('fast') || message.includes('quick')) return this.responses.timeline;
        if (message.includes('fit') || message.includes('right') || message.includes('suitable') || message.includes('good for')) return this.responses.fit;
        if (message.includes('example') || message.includes('client') || message.includes('work') || message.includes('project')) return this.responses.examples;
        if (message.includes('roi') || message.includes('result') || message.includes('save') || message.includes('benefit')) return this.responses.roi;
        if (message.includes('process') || message.includes('how') || message.includes('step') || message.includes('work')) return this.responses.process;
        if (message.includes('contact') || message.includes('call') || message.includes('book') || message.includes('start') || message.includes('begin')) return this.responses.contact;
        if (message.includes('case') || message.includes('study') || message.includes('portfolio') || message.includes('example')) return this.responses["case-studies"];
        if (message.includes('faq') || message.includes('question') || message.includes('help')) return this.responses.faq;
        
        // Default response
        return {
            text: "I'd be happy to help! Here are some things I can tell you about:",
            followUp: ["services", "cost", "timeline", "faq"]
        };
    }

    addMessage(text, type, followUp = null) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        const textP = document.createElement('p');
        const uniqueId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        textP.id = uniqueId;
        
        if (type === 'bot') {
            // Use typewriter effect for bot messages
            textP.className = 'typewriter-text';
            textP.textContent = '';
            messageDiv.appendChild(textP);
        } else {
            // Show user messages immediately
            textP.textContent = text;
            messageDiv.appendChild(textP);
        }

        if (followUp && type === 'bot') {
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'quick-options';
            optionsDiv.style.opacity = '0';
            optionsDiv.style.display = 'none';
            
            followUp.forEach(option => {
                if (this.responses[option]) {
                    const button = document.createElement('button');
                    button.className = 'option-btn';
                    button.dataset.question = option;
                    button.textContent = this.getOptionLabel(option);
                    optionsDiv.appendChild(button);
                }
            });
            
            messageDiv.appendChild(optionsDiv);
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Apply typewriter effect for bot messages
        if (type === 'bot') {
            this.typeMessage(text, uniqueId);
        }
    }

    getOptionLabel(option) {
        const labels = {
            services: "What services?",
            cost: "Pricing info",
            timeline: "How long?",
            fit: "Am I a fit?",
            examples: "Show examples",
            roi: "What results?",
            process: "How it works",
            contact: "Get started",
            "case-studies": "Case studies",
            "book-call": "Book call now",
            faq: "View all FAQs"
        };
        return labels[option] || option;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartChatbot();
});
