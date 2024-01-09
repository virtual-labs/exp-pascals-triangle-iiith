## Theory

# Binomial theorem

Binomial theorem is the algebraic theorem used to expand the term $(x+y)^n$ where n is a non negative integer. More formally

$$(x+y)^n=\sum^n_(k=0)\binom{n}{k}x^ky^(n-k)$$

Where the right hand side in the theorem gives us the binomial expansion.

# Binomial coefficient

Binomial coefficient is $\binom{n}{k}$ which is the coefficient part of the terms in the binomial expansion. As the binomial coefficient does not depend on the value of $x$ and $y$, the value of binomial coefficient remains the same even though the term in binomial expansion for the corresponding $n$ and $k$ might change.

# Pascal's triangle 

Pascal's tringle is a figure that constitues of binomial coefficients $\binom{n}{k}$ from the binomial expansion with $n$, starting from $0$, increasing the further we go down and $k$, starting from $0$, increasing the further we go to the right . It is named after the French mathamatecian Blaise Pascal, though its origins predate him.

![triangle](images/triangle.png)

The figure above represents Pascal's triangle which itself exhibits many interesting properties. Some of these include

- Sum of the elements of any row in the triangle equals to 2^n, when n=0 for the first row.
- The first diagonal after the leftmost one represents the set of natural numbers.
- The second diagonal after the leftmost one represents the set of triangular numbers.
- the value of any element in the triangle can written as sum of the two elements above it.

