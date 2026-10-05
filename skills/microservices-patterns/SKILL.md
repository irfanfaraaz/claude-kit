---
name: microservices-patterns
description: Design microservices architectures with service boundaries, event-driven communication, and resilience patterns. Use when building distributed systems, decomposing monoliths, or implementing microservices.
---

# Microservices Patterns

Master microservices architecture patterns including service boundaries, inter-service communication, data management, and resilience patterns for building distributed systems.

## When to Use This Skill

- Decomposing monoliths into microservices
- Designing service boundaries and contracts
- Implementing inter-service communication
- Managing distributed data and transactions
- Building resilient distributed systems
- Implementing service discovery and load balancing
- Designing event-driven architectures

## Core Concepts

### 1. Service Decomposition Strategies

**By Business Capability**
- Organize services around business functions
- Each service owns its domain
- Example: OrderService, PaymentService, InventoryService

**By Subdomain (DDD)**
- Core domain, supporting subdomains
- Bounded contexts map to services
- Clear ownership and responsibility

**Strangler Fig Pattern**
- Gradually extract from monolith
- New functionality as microservices
- Proxy routes to old/new systems

### 2. Communication Patterns

**Synchronous (Request/Response)**
- REST APIs
- gRPC
- GraphQL

**Asynchronous (Events/Messages)**
- Event streaming (Kafka)
- Message queues (RabbitMQ, SQS)
- Pub/Sub patterns

### 3. Data Management

**Database Per Service**
- Each service owns its data
- No shared databases
- Loose coupling

**Saga Pattern**
- Distributed transactions
- Compensating actions
- Eventual consistency

### 4. Resilience Patterns

**Circuit Breaker**
- Fail fast on repeated errors
- Prevent cascade failures

**Retry with Backoff**
- Transient fault handling
- Exponential backoff

**Bulkhead**
- Isolate resources
- Limit impact of failures

## Service Decomposition Patterns

### Pattern 1: By Business Capability

```python
# E-commerce example

# Order Service
class OrderService:
    """Handles order lifecycle."""

    async def create_order(self, order_data: dict) -> Order:
        order = Order.create(order_data)

        # Publish event for other services
        await self.event_bus.publish(
            OrderCreatedEvent(
                order_id=order.id,
                customer_id=order.customer_id,
                items=order.items,
                total=order.total
            )
        )

        return order

# Payment Service (separate service)
class PaymentService:
    """Handles payment processing."""

    async def process_payment(self, payment_request: PaymentRequest) -> PaymentResult:
        # Process payment
        result = await self.payment_gateway.charge(
            amount=payment_request.amount,
            customer=payment_request.customer_id
        )

        if result.success:
            await self.event_bus.publish(
                PaymentCompletedEvent(
                    order_id=payment_request.order_id,
                    transaction_id=result.transaction_id
                )
            )

        return result

# Inventory Service (separate service)
class InventoryService:
    """Handles inventory management."""

    async def reserve_items(self, order_id: str, items: List[OrderItem]) -> ReservationResult:
        # Check availability
        for item in items:
            available = await self.inventory_repo.get_available(item.product_id)
            if available < item.quantity:
                return ReservationResult(
                    success=False,
                    error=f"Insufficient inventory for {item.product_id}"
                )

        # Reserve items
        reservation = await self.create_reservation(order_id, items)

        await self.event_bus.publish(
            InventoryReservedEvent(
                order_id=order_id,
                reservation_id=reservation.id
            )
        )

        return ReservationResult(success=True, reservation=reservation)
```

### Pattern 2: API Gateway

```python
from fastapi import FastAPI, HTTPException, Depends
import httpx
from circuitbreaker import circuit

app = FastAPI()

class APIGateway:
    """Central entry point for all client requests."""

    def __init__(self):
        self.order_service_url = "http://order-service:8000"
        self.payment_service_url = "http://payment-service:8001"
        self.inventory_service_url = "http://inventory-service:8002"
        self.http_client = httpx.AsyncClient(timeout=5.0)

    @circuit(failure_threshold=5, recovery_timeout=30)
    async def call_order_service(self, path: str, method: str = "GET", **kwargs):
        """Call order service with circuit breaker."""
        response = await self.http_client.request(
            method,
            f"{self.order_service_url}{path}",
            **kwargs
        )
        response.raise_for_status()
        return response.json()

    async def create_order_aggregate(self, order_id: str) -> dict:
        """Aggregate data from multiple services."""
        # Parallel requests
        order, payment, inventory = await asyncio.gather(
            self.call_order_service(f"/orders/{order_id}"),
            self.call_payment_service(f"/payments/order/{order_id}"),
            self.call_inventory_service(f"/reservations/order/{order_id}"),
            return_exceptions=True
        )

        # Handle partial failures
        result = {"order": order}
        if not isinstance(payment, Exception):
            result["payment"] = payment
        if not isinstance(inventory, Exception):
            result["inventory"] = inventory

        return result

@app.post("/api/orders")
async def create_order(
    order_data: dict,
    gateway: APIGateway = Depends()
):
    """API Gateway endpoint."""
    try:
        # Route to order service
        order = await gateway.call_order_service(
            "/orders",
            method="POST",
            json=order_data
        )
        return {"order": order}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail="Order service unavailable")
```

## Communication Patterns

Moved to `references/communication-patterns.md`. Open it when the task needs this part.


## Resilience Patterns

### Circuit Breaker Pattern

```python
from enum import Enum
from datetime import datetime, timedelta
from typing import Callable, Any

class CircuitState(Enum):
    CLOSED = "closed"  # Normal operation
    OPEN = "open"      # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing if recovered

class CircuitBreaker:
    """Circuit breaker for service calls."""

    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: int = 30,
        success_threshold: int = 2
    ):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.success_threshold = success_threshold

        self.failure_count = 0
        self.success_count = 0
        self.state = CircuitState.CLOSED
        self.opened_at = None

    async def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker."""

        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
            else:
                raise CircuitBreakerOpenError("Circuit breaker is open")

        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result

        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        """Handle successful call."""
        self.failure_count = 0

        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = CircuitState.CLOSED
                self.success_count = 0

    def _on_failure(self):
        """Handle failed call."""
        self.failure_count += 1

        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            self.opened_at = datetime.now()

        if self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.OPEN
            self.opened_at = datetime.now()

    def _should_attempt_reset(self) -> bool:
        """Check if enough time passed to try again."""
        return (
            datetime.now() - self.opened_at
            > timedelta(seconds=self.recovery_timeout)
        )

# Usage
breaker = CircuitBreaker(failure_threshold=5, recovery_timeout=30)

async def call_payment_service(payment_data: dict):
    return await breaker.call(
        payment_client.process_payment,
        payment_data
    )
```

## Resources

- **references/service-decomposition-guide.md**: Breaking down monoliths
- **references/communication-patterns.md**: Sync vs async patterns
- **references/saga-implementation.md**: Distributed transactions
- **assets/circuit-breaker.py**: Production circuit breaker
- **assets/event-bus-template.py**: Kafka event bus implementation
- **assets/api-gateway-template.py**: Complete API gateway

## Best Practices

1. **Service Boundaries**: Align with business capabilities
2. **Database Per Service**: No shared databases
3. **API Contracts**: Versioned, backward compatible
4. **Async When Possible**: Events over direct calls
5. **Circuit Breakers**: Fail fast on service failures
6. **Distributed Tracing**: Track requests across services
7. **Service Registry**: Dynamic service discovery
8. **Health Checks**: Liveness and readiness probes

## Common Pitfalls

- **Distributed Monolith**: Tightly coupled services
- **Chatty Services**: Too many inter-service calls
- **Shared Databases**: Tight coupling through data
- **No Circuit Breakers**: Cascade failures
- **Synchronous Everything**: Tight coupling, poor resilience
- **Premature Microservices**: Starting with microservices
- **Ignoring Network Failures**: Assuming reliable network
- **No Compensation Logic**: Can't undo failed transactions
