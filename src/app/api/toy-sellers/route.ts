import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const execAsync = promisify(exec);

/**
 * ⚠️ SECURITY WARNING ⚠️
 * 
 * This file contains MULTIPLE INTENTIONAL SECURITY VULNERABILITIES
 * for runtime security scanner testing and demonstration purposes.
 * 
 * DO NOT use this code in production!
 * DO NOT copy these patterns into real applications!
 * 
 * This is ONLY for security testing and educational purposes.
 * 
 * Vulnerabilities included:
 * - CWE-798: Hardcoded Credentials
 * - CWE-942: CORS Misconfiguration
 * - CWE-89: SQL Injection
 * - CWE-78: OS Command Injection
 * - CWE-22: Path Traversal
 * - CWE-639: Insecure Direct Object Reference (IDOR)
 * - CWE-918: Server-Side Request Forgery (SSRF)
 * - CWE-200: Information Disclosure
 * - CWE-209: Stack Trace Exposure
 * - CWE-256: Plaintext Password Storage
 * - CWE-327: Weak Cryptography (MD5)
 * - CWE-502: Insecure Deserialization
 * - CWE-915: Mass Assignment
 * - CWE-434: Unrestricted File Upload
 * - CWE-611: XML External Entity (XXE)
 * - CWE-1004: Sensitive Cookie Without HttpOnly Flag
 * - CWE-307: Missing Rate Limiting
 * - Prototype Pollution
 */

// CWE-798: Hardcoded Credentials
// VULNERABILITY: Hardcoded secret key that should be in environment variables
const HARDCODED_API_KEY = 'api_key_placeholder_do_not_use';
const HARDCODED_DB_PASSWORD = 'SuperSecret123!@#';
const ADMIN_TOKEN = 'admin_token_12345_do_not_commit';
const JWT_SECRET = 'tailspin-jwt-secret-key-2025';
const ENCRYPTION_KEY = 'my-32-character-ultra-secure-key';

// In-memory user database for testing
const mockUsers = [
  { id: 1, username: 'admin', password: 'admin123', email: 'admin@bachpan.com', role: 'admin', creditCard: '4532-1234-5678-9012' },
  { id: 2, username: 'user', password: 'password', email: 'user@bachpan.com', role: 'user', creditCard: '4532-9876-5432-1098' },
];

/**
 * GET /api/toy-search
 * 
 * Main search endpoint with multiple vulnerabilities for testing
 */
export async function GET(request: NextRequest) {
  // CWE-942: CORS Misconfiguration
  // VULNERABILITY: Allowing all origins without validation
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', '*');
  headers.set('Access-Control-Allow-Credentials', 'true'); // VULNERABILITY: Credentials with wildcard origin

  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'info';

    // CWE-200: Information Disclosure
    // VULNERABILITY: Exposing sensitive configuration and credentials in response
    const debugInfo = {
      apiKey: HARDCODED_API_KEY,
      dbPassword: HARDCODED_DB_PASSWORD,
      adminToken: ADMIN_TOKEN,
      jwtSecret: JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
      dbUrl: process.env.DATABASE_URL,
      timestamp: new Date().toISOString(),
      serverInfo: 'Next.js 15.0.0 on Node.js',
      processEnv: process.env, // VULNERABILITY: Exposing all environment variables
    };

    // Route to different vulnerable handlers based on action
    switch (action) {
      case 'search':
      case 'prototype':
        return await handlePrototypePollution(request, debugInfo, headers);
      case 'sql':
        return await handleSqlInjection(request, debugInfo, headers);
      case 'command':
        return await handleCommandInjection(request, debugInfo, headers);
      case 'file':
        return await handlePathTraversal(request, debugInfo, headers);
      case 'user':
      case 'idor':
        return await handleIDOR(request, debugInfo, headers);
      case 'fetch':
      case 'ssrf':
        return await handleSSRF(request, debugInfo, headers);
      case 'encrypt':
        return await handleWeakCrypto(request, debugInfo, headers);
      case 'deserialize':
        return await handleInsecureDeserialization(request, debugInfo, headers);
      case 'login':
        return await handleInsecureLogin(request, debugInfo, headers);
      case 'xml':
      case 'xxe':
        return await handleXXE(request, debugInfo, headers);
      case 'info':
      case 'debug':
        return NextResponse.json({
          warning: '⚠️ This endpoint contains intentional vulnerabilities for security testing',
          message: 'DO NOT use in production!',
          availableActions: [
            'search/prototype - Prototype Pollution',
            'sql - SQL Injection',
            'command - Command Injection', 
            'file - Path Traversal',
            'user/idor - Insecure Direct Object Reference',
            'fetch/ssrf - Server-Side Request Forgery',
            'encrypt - Weak Cryptography',
            'deserialize - Insecure Deserialization',
            'login - Insecure Authentication',
            'xml/xxe - XML External Entity',
          ],
          debugInfo,
        }, { headers });
      default:
        return NextResponse.json({
          error: 'Unknown action',
          availableActions: ['search', 'sql', 'command', 'file', 'user', 'fetch', 'encrypt', 'deserialize', 'login', 'xml'],
          debugInfo,
        }, { headers });
    }
  } catch (error) {
    // CWE-209: Stack Trace Exposure
    // VULNERABILITY: Exposing detailed stack traces to users
    return NextResponse.json(
      {
        error: 'Operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        sensitiveDebug: {
          apiKey: HARDCODED_API_KEY,
          jwtSecret: JWT_SECRET,
          timestamp: Date.now(),
          environment: process.env,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Prototype Pollution vulnerability
 * VULNERABILITY: Dynamic property assignment allows __proto__ pollution
 */
async function handlePrototypePollution(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId') || 'guest';
  const prefsData = searchParams.get('prefs');
  const userPreferences = prefsData ? JSON.parse(prefsData) : {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchConfig: Record<string, any> = {
    sortBy: 'name',
    limit: 10,
    includeOutOfStock: false,
  };

  // VULNERABILITY: No validation of keys, allows __proto__ pollution
  for (const key in userPreferences) {
    searchConfig[key] = userPreferences[key];
  }

  const toys = await prisma.toy.findMany({
    take: searchConfig.limit,
    orderBy: { [searchConfig.sortBy]: 'asc' },
  });

  return NextResponse.json({
    vulnerability: 'Prototype Pollution',
    cwe: 'CWE-1321',
    userId,
    toys,
    appliedConfig: searchConfig,
    debugInfo,
  }, { headers });
}

/**
 * CWE-89: SQL Injection
 * VULNERABILITY: Unsanitized input concatenated directly into SQL query
 */
async function handleSqlInjection(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'all';
  const sortOrder = searchParams.get('sort') || 'ASC';
  const searchTerm = searchParams.get('q') || '';

  // VULNERABILITY: Direct string concatenation in raw SQL query
  // Allows injection like: category=all' OR '1'='1
  // Or: q=test' UNION SELECT * FROM User--
  const query = `SELECT * FROM Toy WHERE category = '${category}' AND name LIKE '%${searchTerm}%' ORDER BY price ${sortOrder}`;

  try {
    // Execute raw SQL with user input
    const toys = await prisma.$queryRawUnsafe(query);

    return NextResponse.json({
      vulnerability: 'SQL Injection',
      cwe: 'CWE-89',
      query,
      toys,
      hint: "Try: ?action=sql&category=all' OR '1'='1&sort=ASC",
      moreHints: [
        "?action=sql&q=test' UNION SELECT * FROM User--",
        "?action=sql&category=all'--&sort=DESC",
      ],
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'SQL Injection',
      error: error instanceof Error ? error.message : 'Query failed',
      stack: error instanceof Error ? error.stack : undefined,
      query,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * CWE-78: OS Command Injection
 * VULNERABILITY: User input directly passed to shell execution
 */
async function handleCommandInjection(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename') || 'toys';
  const format = searchParams.get('format') || 'json';

  // VULNERABILITY: Unsanitized user input in shell command
  // Allows injection like: filename=toys; ls -la; cat /etc/passwd
  const command = `echo "Exporting ${filename} as ${format}"`;

  try {
    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json({
      vulnerability: 'Command Injection',
      cwe: 'CWE-78',
      command,
      output: stdout,
      stderr,
      hint: "Try: ?action=command&filename=test;whoami",
      moreHints: [
        "?action=command&filename=test;ls -la",
        "?action=command&filename=test && cat /etc/passwd",
      ],
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'Command Injection',
      error: error instanceof Error ? error.message : 'Command failed',
      stack: error instanceof Error ? error.stack : undefined,
      command,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * CWE-22: Path Traversal
 * VULNERABILITY: User-controlled file path without validation
 */
async function handlePathTraversal(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('path') || 'toys.txt';

  // VULNERABILITY: No validation of file path, allows directory traversal
  // Allows reading arbitrary files like: path=../../etc/passwd
  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const content = await fs.readFile(fullPath, 'utf-8');

    return NextResponse.json({
      vulnerability: 'Path Traversal',
      cwe: 'CWE-22',
      requestedPath: filePath,
      resolvedPath: fullPath,
      content,
      hint: "Try: ?action=file&path=../../../etc/passwd",
      moreHints: [
        "?action=file&path=../../package.json",
        "?action=file&path=../../../../../etc/hosts",
      ],
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'Path Traversal',
      error: error instanceof Error ? error.message : 'File read failed',
      stack: error instanceof Error ? error.stack : undefined,
      requestedPath: filePath,
      resolvedPath: fullPath,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * CWE-639: Insecure Direct Object Reference (IDOR)
 * VULNERABILITY: No authorization check before accessing user data
 */
async function handleIDOR(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const targetUserId = searchParams.get('id');

  if (!targetUserId) {
    // VULNERABILITY: Exposing user list without authentication
    return NextResponse.json({
      vulnerability: 'IDOR + Information Disclosure',
      cwe: 'CWE-639, CWE-200',
      users: mockUsers, // Exposing all users with sensitive data
      hint: 'Try: ?action=user&id=1 or ?action=user&id=2',
      debugInfo,
    }, { headers });
  }

  // VULNERABILITY: No check if current user is authorized to access this data
  const user = mockUsers.find(u => u.id === parseInt(targetUserId));

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { headers, status: 404 });
  }

  // VULNERABILITY: Exposing sensitive user data including credit card
  // Simulating order data for demonstration with actual toy products
  const mockOrders = [
    {
      id: `order_${targetUserId}_1`,
      userId: targetUserId,
      total: 697,
      items: [
        { name: 'Brick Game', quantity: 1, price: 199 },
        { name: 'Channapatna Wooden Toys', quantity: 1, price: 499 },
      ],
      status: 'Delivered',
      createdAt: new Date('2025-11-15'),
      shippingAddress: '123 Gully Street, Mumbai, Maharashtra 400001',
    },
    {
      id: `order_${targetUserId}_2`,
      userId: targetUserId,
      total: 477,
      items: [
        { name: 'Rainbow Slinky', quantity: 1, price: 99 },
        { name: 'Waterful Ring Toss', quantity: 1, price: 179 },
        { name: 'Brick Game', quantity: 1, price: 199 },
      ],
      status: 'Shipped',
      createdAt: new Date('2025-11-28'),
      shippingAddress: '123 Gully Street, Mumbai, Maharashtra 400001',
    },
  ];

  return NextResponse.json({
    vulnerability: 'Insecure Direct Object Reference (IDOR)',
    cwe: 'CWE-639',
    targetUserId,
    user, // Includes password, credit card, etc.
    orders: mockOrders,
    hint: 'Any user can access any other user\'s data by changing the ID parameter',
    debugInfo,
  }, { headers });
}

/**
 * CWE-918: Server-Side Request Forgery (SSRF)
 * VULNERABILITY: Fetching user-controlled URLs without validation
 */
async function handleSSRF(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ 
      error: 'URL parameter required',
      hint: 'Try: ?action=ssrf&url=http://localhost:3000',
    }, { headers, status: 400 });
  }

  try {
    // VULNERABILITY: No validation of URL, allows requests to internal services
    // Allows SSRF like: url=http://localhost:6379 (Redis)
    // or: url=http://169.254.169.254/latest/meta-data/ (AWS metadata)
    // or: url=file:///etc/passwd
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({
      vulnerability: 'Server-Side Request Forgery (SSRF)',
      cwe: 'CWE-918',
      requestedUrl: url,
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      hint: 'Try: ?action=ssrf&url=http://localhost:3000 or internal IPs',
      moreHints: [
        '?action=ssrf&url=http://169.254.169.254/latest/meta-data/',
        '?action=ssrf&url=http://localhost:6379',
        '?action=ssrf&url=http://127.0.0.1:3000/api/toy-search?action=debug',
      ],
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'Server-Side Request Forgery (SSRF)',
      error: error instanceof Error ? error.message : 'Fetch failed',
      stack: error instanceof Error ? error.stack : undefined,
      requestedUrl: url,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * CWE-327: Weak Cryptography
 * VULNERABILITY: Using weak MD5 hashing for sensitive data
 */
async function handleWeakCrypto(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const text = searchParams.get('text') || 'password123';

  // VULNERABILITY: Using weak MD5 hashing instead of bcrypt/argon2
  const md5Hash = crypto.createHash('md5').update(text).digest('hex');
  
  // VULNERABILITY: Using weak SHA1 hashing
  const sha1Hash = crypto.createHash('sha1').update(text).digest('hex');

  // VULNERABILITY: Weak DES encryption
  const cipher = crypto.createCipheriv('des-ecb', Buffer.from(ENCRYPTION_KEY.substring(0, 8)), null);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return NextResponse.json({
    vulnerability: 'Weak Cryptography',
    cwe: 'CWE-327',
    originalText: text,
    md5: md5Hash,
    sha1: sha1Hash,
    desEncrypted: encrypted,
    warning: 'MD5, SHA1, and DES are cryptographically broken and should never be used',
    hint: 'Try: ?action=encrypt&text=admin123',
    debugInfo,
  }, { headers });
}

/**
 * CWE-502: Insecure Deserialization
 * VULNERABILITY: Deserializing untrusted data using eval
 */
async function handleInsecureDeserialization(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const serializedData = searchParams.get('data');

  if (!serializedData) {
    return NextResponse.json({
      error: 'Data parameter required',
      hint: 'Try: ?action=deserialize&data={"user":"admin"}',
    }, { headers, status: 400 });
  }

  try {
    // VULNERABILITY: Using eval to deserialize untrusted data
    // This allows arbitrary code execution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deserialized = eval('(' + serializedData + ')') as any;

    return NextResponse.json({
      vulnerability: 'Insecure Deserialization',
      cwe: 'CWE-502',
      originalData: serializedData,
      deserialized,
      warning: 'Never use eval() on untrusted data - allows arbitrary code execution',
      hint: 'Try: ?action=deserialize&data={"constructor":{"prototype":{"isAdmin":true}}}',
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'Insecure Deserialization',
      error: error instanceof Error ? error.message : 'Deserialization failed',
      stack: error instanceof Error ? error.stack : undefined,
      originalData: serializedData,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * CWE-256: Plaintext Password Storage + CWE-1004: Insecure Cookie
 * VULNERABILITY: Multiple authentication vulnerabilities
 */
async function handleInsecureLogin(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const password = searchParams.get('password');

  if (!username || !password) {
    return NextResponse.json({
      error: 'Username and password required',
      hint: 'Try: ?action=login&username=admin&password=admin123',
      users: mockUsers.map(u => ({ username: u.username, hint: 'password field is stored in plaintext' })),
    }, { headers, status: 400 });
  }

  // VULNERABILITY: Simulating SQL injection in login
  // admin' OR '1'='1 would bypass authentication
  let user = mockUsers.find(u => u.username === username && u.password === password);

  if (!user && (username.includes("' OR '1'='1") || username.includes("admin' --"))) {
    // VULNERABILITY: SQL injection allows authentication bypass
    user = mockUsers.find(u => u.username === 'admin');
  }

  if (!user) {
    return NextResponse.json({
      success: false,
      error: 'Invalid credentials',
      hint: 'Try SQL injection: ?action=login&username=admin\' OR \'1\'=\'1&password=anything',
    }, { headers, status: 401 });
  }

  // VULNERABILITY: Weak JWT with hardcoded secret
  const token = `${user.id}:${user.role}:${JWT_SECRET}`;

  // CWE-1004: Insecure cookie configuration
  const response = NextResponse.json({
    vulnerability: 'Multiple Auth Vulnerabilities',
    cwe: 'CWE-256 (Plaintext Password), CWE-89 (SQL Injection), CWE-1004 (Insecure Cookie)',
    success: true,
    user, // VULNERABILITY: Exposing full user object including password and credit card
    token,
    debugInfo,
  }, { headers });

  // VULNERABILITY: Cookie without HttpOnly flag (allows XSS to steal it)
  // VULNERABILITY: Cookie without Secure flag (can be sent over HTTP)
  // VULNERABILITY: Cookie without SameSite protection (vulnerable to CSRF)
  response.cookies.set('auth_token', token, {
    httpOnly: false, // VULNERABILITY: JavaScript can access this cookie
    secure: false,   // VULNERABILITY: Can be sent over HTTP
    sameSite: 'none', // VULNERABILITY: No CSRF protection
    maxAge: 86400,
  });

  return response;
}

/**
 * CWE-611: XML External Entity (XXE)
 * VULNERABILITY: Processing XML with external entities enabled
 */
async function handleXXE(request: NextRequest, debugInfo: object, headers: Headers) {
  const searchParams = request.nextUrl.searchParams;
  const xmlData = searchParams.get('xml');

  if (!xmlData) {
    return NextResponse.json({
      error: 'XML parameter required',
      hint: 'Try: ?action=xml&xml=<?xml version="1.0"?><toy><name>Carrom</name></toy>',
      xxeExample: '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><toy><name>&xxe;</name></toy>',
    }, { headers, status: 400 });
  }

  try {
    // VULNERABILITY: Would normally use an XML parser with external entities enabled
    // For demonstration, we'll simulate the vulnerability
    const hasXXE = xmlData.includes('<!ENTITY') || xmlData.includes('SYSTEM');

    return NextResponse.json({
      vulnerability: 'XML External Entity (XXE)',
      cwe: 'CWE-611',
      receivedXML: xmlData,
      parsed: 'XML parsing simulation',
      xxeDetected: hasXXE,
      warning: 'In a real scenario, this would process external entities and could read local files',
      hint: 'XXE payload: <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><toy><name>&xxe;</name></toy>',
      debugInfo,
    }, { headers });
  } catch (error) {
    return NextResponse.json({
      vulnerability: 'XML External Entity (XXE)',
      error: error instanceof Error ? error.message : 'XML processing failed',
      stack: error instanceof Error ? error.stack : undefined,
      debugInfo,
    }, { headers, status: 500 });
  }
}

/**
 * POST handler - demonstrates additional vulnerabilities
 * CWE-915: Mass Assignment
 * CWE-434: Unrestricted File Upload
 */
export async function POST(request: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Credentials', 'true');

  try {
    const contentType = request.headers.get('content-type');
    const action = request.nextUrl.searchParams.get('action') || 'register';

    if (action === 'register') {
      // CWE-915: Mass Assignment
      const userData = await request.json();

      // VULNERABILITY: No validation of fields, user can set any property including 'role'
      const newUser = {
        id: mockUsers.length + 1,
        username: userData.username,
        password: userData.password, // CWE-256: Storing plaintext password
        email: userData.email,
        role: userData.role || 'user', // VULNERABILITY: User can set themselves as admin
        creditCard: userData.creditCard || '',
        isAdmin: userData.isAdmin, // VULNERABILITY: Direct property assignment
        // Any other properties from userData are accepted without validation
        ...userData,
      };

      mockUsers.push(newUser);

      return NextResponse.json({
        vulnerability: 'Mass Assignment + Plaintext Password Storage',
        cwe: 'CWE-915, CWE-256',
        success: true,
        user: newUser,
        hint: 'Try sending: {"username":"hacker","password":"pass","role":"admin","isAdmin":true}',
        debugInfo: {
          apiKey: HARDCODED_API_KEY,
          allUsers: mockUsers,
        },
      }, { headers });
    }

    if (action === 'upload') {
      // CWE-434: Unrestricted File Upload
      const body = await request.json();
      const { filename, content } = body;

      // VULNERABILITY: No file type validation
      // VULNERABILITY: No file size limits
      // VULNERABILITY: No malware scanning
      // Accepts any file extension including .php, .exe, .sh, etc.

      return NextResponse.json({
        vulnerability: 'Unrestricted File Upload',
        cwe: 'CWE-434',
        success: true,
        filename,
        contentPreview: content?.substring(0, 100),
        warning: 'No validation on file type, size, or content - could upload malicious files',
        hint: 'Try uploading: {"filename":"shell.php","content":"<?php system($_GET[\'cmd\']); ?>"}',
        debugInfo: {
          apiKey: HARDCODED_API_KEY,
        },
      }, { headers });
    }

    // Default POST response with information disclosure
    const body = contentType?.includes('application/json') 
      ? await request.json()
      : await request.text();

    return NextResponse.json({
      warning: 'POST endpoint with vulnerabilities',
      receivedData: body,
      serverSecrets: {
        apiKey: HARDCODED_API_KEY,
        dbPassword: HARDCODED_DB_PASSWORD,
        adminToken: ADMIN_TOKEN,
        jwtSecret: JWT_SECRET,
      },
      environment: process.env, // CWE-200: Information Disclosure
    }, { headers });
  } catch (error) {
    // CWE-209: Stack Trace Exposure
    return NextResponse.json({
      error: 'POST request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      debugSecrets: {
        apiKey: HARDCODED_API_KEY,
        jwtSecret: JWT_SECRET,
        timestamp: Date.now(),
      },
    }, { headers, status: 500 });
  }
}

/**
 * OPTIONS handler for CORS preflight
 * CWE-942: CORS Misconfiguration
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // VULNERABILITY: Allows any origin
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true', // VULNERABILITY: Credentials with wildcard
      'Access-Control-Max-Age': '86400',
    },
  });
}
