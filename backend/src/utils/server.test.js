const {normalizePort} = require("utils/server");

test("Hello World", () => {
    expect(true).toBeTruthy();
});

test("normalizePort", () => {
    expect(normalizePort(8080)).toBe(8080);
    expect(normalizePort(-1)).toBeFalsy();
    expect(normalizePort("8080")).toBe(8080);
    expect(normalizePort("named pipe")).toBe("named pipe");
});
