# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions are:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you believe you have found a security vulnerability in FinAdvise2, please report it to us through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please send an email to [shawn81404@gmail.com].

Please include as much of the information listed below as you can to help us better understand and resolve the issue:

* The type of issue (e.g., buffer overflow, SQL injection, or cross-site scripting)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Measures

We implement several security measures in this project:

1. **Dependency Scanning**
   - Regular automated security scanning using GitHub Actions
   - Weekly Snyk vulnerability scans
   - npm audit checks on every dependency update

2. **Code Analysis**
   - CodeQL analysis for JavaScript
   - Automated security checks on pull requests

3. **Development Practices**
   - Strict Content Security Policy (CSP)
   - Input validation and sanitization
   - XSS protection
   - CSRF protection
   - Rate limiting
   - Security headers using Helmet

4. **npm Security**
   - Strict SSL enforcement
   - Package lock verification
   - Script execution restrictions
   - Regular dependency updates
