describe('Environment Variables', () => {
    test('should load environment variables correctly', () => {
        expect(process.env.PORT).toBe('8000');
        expect(process.env.SERVER_URL).toBe(`${process.env.SERVER_URL}`);
        expect(process.env.MONGODB_URL).toBe('mongodb+srv://bilgerjeremy5705:b8209ze6531@cluster0.icxtwoq.mongodb.net/IntegDeploy?retryWrites=true&w=majority&appName=Cluster0');
        expect(process.env.FRONT_URL).toBe('http://localhost:3000');
    });
});
