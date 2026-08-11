/* ============================================================================
   PONTE VERSO QuantumSim — il simulatore di riferimento

   Legge un circuito da standard input e stampa le ampiezze finali, una per
   riga. Serve a confrontare il nostro simulatore (js/core/qsim.js) con
   un'implementazione indipendente, scritta da un'altra persona in un altro
   linguaggio: se due programmi diversi, partendo dalle stesse porte, arrivano
   alle stesse ampiezze fino alla dodicesima cifra, l'errore comune è
   improbabile.

   QuantumSim è di Francesco Sisini — https://github.com/francescosisini/QuantumSim
   Questo file NON contiene codice di QuantumSim: lo chiama e basta. Viene
   compilato solo quando si lancia la verifica, e non finisce nel sito.

   Formato d'ingresso:
     <numero di qubit>
     H 0
     CNOT 0 1
     P 2 0.7853981633974483
     ...
     END
   ============================================================================ */
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <complex.h>
#include "quantum_sim.h"

int main(void) {
  int n;
  if (scanf("%d", &n) != 1) return 1;

  QubitState *st = initializeState(n);
  char op[32];

  while (scanf("%31s", op) == 1) {
    if (strcmp(op, "END") == 0) break;

    int a, b, c;
    double t;
    if      (strcmp(op, "H")    == 0 && scanf("%d", &a) == 1) applyHadamard(st, a);
    else if (strcmp(op, "X")    == 0 && scanf("%d", &a) == 1) applyX(st, a);
    else if (strcmp(op, "Y")    == 0 && scanf("%d", &a) == 1) applyY(st, a);
    else if (strcmp(op, "Z")    == 0 && scanf("%d", &a) == 1) applyZ(st, a);
    else if (strcmp(op, "S")    == 0 && scanf("%d", &a) == 1) applyS(st, a);
    else if (strcmp(op, "T")    == 0 && scanf("%d", &a) == 1) applyT(st, a);
    else if (strcmp(op, "TDG")  == 0 && scanf("%d", &a) == 1) applyTdag(st, a);
    else if (strcmp(op, "P")    == 0 && scanf("%d %lf", &a, &t) == 2) applyPhase(st, a, t);
    else if (strcmp(op, "CNOT") == 0 && scanf("%d %d", &a, &b) == 2) applyCNOT(st, a, b);
    else if (strcmp(op, "CZ")   == 0 && scanf("%d %d", &a, &b) == 2) applyCZ(st, a, b);
    else if (strcmp(op, "CCX")  == 0 && scanf("%d %d %d", &a, &b, &c) == 3) applyToffoli(st, a, b, c);
    else { fprintf(stderr, "porta sconosciuta: %s\n", op); return 2; }
  }

  long long dim = 1LL << n;
  for (long long i = 0; i < dim; i++)
    printf("%.15f %.15f\n", creal(st->amplitudes[i]), cimag(st->amplitudes[i]));

  freeState(st);
  return 0;
}
